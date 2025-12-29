import { URL } from "url";
import { EventEmitter } from "events";
import { HttpClient } from "./HttpClient";
import { RobotsChecker } from "./RobotsChecker";
import { SitemapChecker } from "./SitemapChecker";
import { UrlStorage } from "./UrlStorage";
import { Queue, QueueItem } from "./Queue";
import { HtmlParser, ParsedPage } from "./HtmlParser";

export interface CrawlerOptions {
  crawlLimit?: number;
  ignoreRobotsTxt?: boolean;
  followNofollow?: boolean;
  includeNoindex?: boolean;
  crawlSitemap?: boolean;
  allowSubdomains?: boolean;
  checkExternalLinks?: boolean;
  userAgent?: string;
  basicAuth?: {
    username: string;
    password: string;
  };
}

export interface CrawlStatus {
  crawled: number;
  discovered: number;
  crawling: boolean;
}

export interface ResponseMessage {
  url: URL;
  parsedPage?: ParsedPage;
  error?: Error;
  ttfb: number;
  blocked: boolean;
  inSitemap: boolean;
  timeout: boolean;
  statusCode?: number;
}

export class Crawler extends EventEmitter {
  private baseUrl: URL;
  private options: CrawlerOptions;
  private httpClient: HttpClient;
  private robotsChecker?: RobotsChecker;
  private sitemapChecker?: SitemapChecker;
  private urlStorage: UrlStorage;
  private sitemapStorage: UrlStorage;
  private queue: Queue;
  private status: CrawlStatus;
  private running: boolean = false;
  private consumerThreads: number = 2;
  private randomDelay: number = 1500;

  constructor(url: string, options: CrawlerOptions = {}) {
    super();

    this.baseUrl = new URL(url);
    this.options = options;

    this.httpClient = new HttpClient({
      userAgent: options.userAgent,
      basicAuth: options.basicAuth,
    });

    this.urlStorage = new UrlStorage();
    this.sitemapStorage = new UrlStorage();
    this.queue = new Queue();

    this.status = {
      crawled: 0,
      discovered: 0,
      crawling: false,
    };
  }

  async start(): Promise<void> {
    if (this.running) {
      throw new Error("Crawler is already running");
    }

    this.running = true;
    this.status.crawling = true;

    try {
      // Setup robots.txt
      if (!this.options.ignoreRobotsTxt) {
        this.emit("status_update", "Fetching robots.txt...");
        this.robotsChecker = new RobotsChecker(
          this.baseUrl.href,
          this.httpClient.getUserAgent()
        );
        await this.robotsChecker.fetch(this.httpClient);
        this.emit("status_update", "robots.txt fetched and parsed.");
      }

      // Setup sitemaps
      if (this.options.crawlSitemap) {
        this.emit("status_update", "Searching for sitemaps...");
        await this.setupSitemaps();
        this.emit("status_update", "Sitemaps processed.");
      }

      // Add initial URL to queue
      await this.addRequest({
        url: this.baseUrl,
        method: "GET",
      });

      // Emit initial response for the starting URL to show activity
      this.emit("progress", this.status);

      // Start crawling
      this.emit("status_update", `Starting crawl of ${this.baseUrl.href}`);
      await this.crawl();
    } catch (error) {
      this.emit("error", error);
    } finally {
      this.running = false;
      this.status.crawling = false;
      this.emit("complete", this.status);
    }
  }

  stop(): void {
    this.running = false;
    this.status.crawling = false;
    this.queue.clear();
  }

  async addRequest(request: QueueItem): Promise<void> {
    const urlString = request.url.href;

    // Check if already visited
    if (this.urlStorage.has(urlString)) {
      return;
    }

    // Check domain
    if (!request.ignoreDomain && !this.domainIsAllowed(request.url.hostname)) {
      return;
    }

    // Check robots.txt
    if (this.robotsChecker && !this.options.ignoreRobotsTxt) {
      if (!this.robotsChecker.isAllowed(urlString)) {
        this.emit("response", {
          url: request.url,
          blocked: true,
          inSitemap: this.sitemapStorage.has(urlString),
          ttfb: 0,
          timeout: false,
        });
        return;
      }
    }

    // Add to queue
    this.urlStorage.add(urlString);
    this.queue.add(request);
    this.status.discovered++;
  }

  getStatus(): CrawlStatus {
    return { ...this.status };
  }

  sitemapExists(): boolean {
    return this.sitemapChecker?.sitemapExists() || false;
  }

  robotstxtExists(): boolean {
    return this.robotsChecker?.robotsExists() || false;
  }

  private async setupSitemaps(): Promise<void> {
    this.sitemapChecker = new SitemapChecker();

    // Try default sitemap location
    const defaultSitemapUrl = `${this.baseUrl.protocol}//${this.baseUrl.host}/sitemap.xml`;
    await this.sitemapChecker.fetch(defaultSitemapUrl);

    // Try sitemaps from robots.txt
    if (this.robotsChecker) {
      const robotsSitemaps = this.robotsChecker.getSitemaps();
      for (const sitemapUrl of robotsSitemaps) {
        await this.sitemapChecker.fetch(sitemapUrl);
      }
    }

    // Store sitemap URLs
    const sitemapUrls = this.sitemapChecker.getUrls();
    for (const url of sitemapUrls) {
      this.sitemapStorage.add(url);
    }
  }

  private async crawl(): Promise<void> {
    const workers: Promise<void>[] = [];

    // Start consumer threads
    for (let i = 0; i < this.consumerThreads; i++) {
      workers.push(this.consumer());
    }

    // Wait for all workers to complete
    await Promise.all(workers);
  }

  private async consumer(): Promise<void> {
    while (this.running) {
      const request = this.queue.poll();

      if (!request) {
        // No more items in queue
        if (this.status.crawled >= this.status.discovered) {
          break;
        }
        // Wait a bit for more items
        await this.delay(100);
        continue;
      }

      // Check crawl limit
      if (
        this.options.crawlLimit &&
        this.status.crawled >= this.options.crawlLimit
      ) {
        break;
      }

      // Add random delay
      await this.delay(Math.random() * this.randomDelay);

      // Process request
      await this.processRequest(request);
    }
  }

  private async processRequest(request: QueueItem): Promise<void> {
    const urlString = request.url.href;
    const inSitemap = this.sitemapStorage.has(urlString);

    try {
      const method = request.method || "GET";
      const { response, ttfb } =
        method === "HEAD"
          ? await this.httpClient.head(urlString)
          : await this.httpClient.get(urlString);

      this.status.crawled++;

      // Parse HTML if it's a successful HTML response
      let parsedPage: ParsedPage | undefined;

      if (
        response.status === 200 &&
        response.headers["content-type"]?.includes("text/html")
      ) {
        parsedPage = HtmlParser.parse(
          response.data,
          urlString,
          response.status,
          response.headers
        );

        // Extract and queue links
        if (parsedPage.links) {
          for (const link of parsedPage.links) {
            try {
              const linkUrl = new URL(link.url);

              // Check nofollow
              if (link.nofollow && !this.options.followNofollow) {
                continue;
              }

              await this.addRequest({
                url: linkUrl,
                method: "GET",
              });
            } catch (error) {
              // Invalid URL, skip
            }
          }
        }
      }

      // Emit response
      this.emit("response", {
        url: request.url,
        parsedPage,
        ttfb,
        blocked: false,
        inSitemap,
        timeout: false,
        statusCode: response.status,
      } as ResponseMessage);
    } catch (error: any) {
      const isTimeout = error.message === "Request timeout";

      this.emit("response", {
        url: request.url,
        error,
        ttfb: 0,
        blocked: false,
        inSitemap,
        timeout: isTimeout,
        statusCode: error.response?.status || 0,
      } as ResponseMessage);
    }
  }

  private domainIsAllowed(hostname: string): boolean {
    if (hostname === this.baseUrl.hostname) {
      return true;
    }

    if (this.options.allowSubdomains) {
      return hostname.endsWith(`.${this.baseUrl.hostname}`);
    }

    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
