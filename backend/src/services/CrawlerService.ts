import { Crawler, CrawlerOptions, ResponseMessage } from '../crawler/Crawler';
import { db } from '../db';
import { projects, crawls, pageReports, issues, links, externalLinks, images, videos, scripts, styles } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import { IssueAnalyzer } from './issues/IssueAnalyzer';
import { Broker, EventType } from '../websocket/broker';

export class CrawlerService {
  private activeCrawlers: Map<number, Crawler> = new Map();

  async startCrawl(projectId: number): Promise<number> {
    // Get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if already crawling
    if (this.activeCrawlers.has(projectId)) {
      throw new Error('Crawl already in progress for this project');
    }

    // Create crawl record
    const [newCrawl] = await db.insert(crawls).values({
      projectId,
      start: new Date(),
    }).returning();

    // Setup crawler options
    const options: CrawlerOptions = {
      ignoreRobotsTxt: project.ignoreRobotstxt,
      followNofollow: project.followNofollow,
      includeNoindex: project.includeNoindex,
      crawlSitemap: project.crawlSitemap,
      allowSubdomains: project.allowSubdomains,
      checkExternalLinks: project.checkExternalLinks,
      userAgent: project.userAgent || undefined,
      crawlLimit: 10000,
    };

    // Create crawler
    const crawler = new Crawler(project.url, options);

    // Store active crawler
    this.activeCrawlers.set(projectId, crawler);

    // Setup event handlers
    crawler.on('response', async (response: ResponseMessage) => {
      await this.handleResponse(newCrawl.id, response);
      
      // Publish progress
      const status = crawler.getStatus();
      Broker.publish(EventType.CRAWL_PROGRESS, {
        projectId,
        crawlId: newCrawl.id,
        ...status,
        lastUrl: response.url.href,
      });
    });

    crawler.on('complete', async (status) => {
      // Update crawl record
      await db.update(crawls)
        .set({
          end: new Date(),
          totalUrls: status.crawled,
          robotstxtExists: crawler.robotstxtExists(),
          sitemapExists: crawler.sitemapExists(),
        })
        .where(eq(crawls.id, newCrawl.id));

      // Analyze issues
      await this.analyzeIssues(newCrawl.id);

      // Publish completion
      Broker.publish(EventType.CRAWL_COMPLETED, {
        projectId,
        crawlId: newCrawl.id,
        status,
      });

      // Remove from active crawlers
      this.activeCrawlers.delete(projectId);
    });

    crawler.on('error', (error) => {
      console.error('Crawler error:', error);
      Broker.publish(EventType.CRAWL_STOPPED, {
        projectId,
        crawlId: newCrawl.id,
        error: error.message,
      });
      this.activeCrawlers.delete(projectId);
    });

    // Publish start
    Broker.publish(EventType.CRAWL_STARTED, {
      projectId,
      crawlId: newCrawl.id,
    });

    // Start crawling
    crawler.start().catch(error => {
      console.error('Crawler start error:', error);
    });

    return newCrawl.id;
  }

  async stopCrawl(projectId: number): Promise<void> {
    const crawler = this.activeCrawlers.get(projectId);
    if (crawler) {
      crawler.stop();
      this.activeCrawlers.delete(projectId);
    }
  }

  getCrawlStatus(projectId: number) {
    const crawler = this.activeCrawlers.get(projectId);
    if (crawler) {
      return crawler.getStatus();
    }
    return null;
  }

  private async handleResponse(crawlId: number, response: ResponseMessage): Promise<void> {
    try {
      const { parsedPage, url, ttfb, blocked, inSitemap, timeout } = response;

      let pageReportId: number;

      if (!parsedPage) {
        // Handle non-HTML or error responses
        const [pr] = await db.insert(pageReports).values({
          crawlId,
          url: url.href,
          scheme: url.protocol.replace(':', ''),
          statusCode: 0,
          urlHash: this.generateHash(url.href),
          blockedByRobotstxt: blocked,
          timeout,
          inSitemap,
          ttfb,
          crawled: true,
        }).returning();
        pageReportId = pr.id;
      } else {
        // Create page report
        const [pr] = await db.insert(pageReports).values({
          crawlId,
          url: parsedPage.url,
          scheme: parsedPage.scheme,
          redirectUrl: parsedPage.redirectUrl,
          refresh: parsedPage.refresh,
          statusCode: parsedPage.statusCode,
          contentType: parsedPage.contentType,
          mediaType: parsedPage.mediaType,
          lang: parsedPage.lang,
          title: parsedPage.title,
          description: parsedPage.description,
          robots: parsedPage.robots,
          canonical: parsedPage.canonical,
          h1: parsedPage.h1,
          h2: parsedPage.h2,
          words: parsedPage.words,
          size: parsedPage.size,
          urlHash: parsedPage.urlHash,
          redirectHash: parsedPage.redirectHash,
          bodyHash: parsedPage.bodyHash,
          blockedByRobotstxt: blocked,
          inSitemap,
          timeout,
          ttfb,
          crawled: true,
        }).returning();
        pageReportId = pr.id;

        // Store links
        if (parsedPage.links && parsedPage.links.length > 0) {
          await db.insert(links).values(parsedPage.links.map(link => ({
            pagereportId: pageReportId,
            crawlId,
            url: link.url,
            scheme: link.scheme,
            rel: link.rel,
            text: link.text,
            urlHash: this.generateHash(link.url),
            nofollow: link.nofollow,
            sponsored: link.sponsored,
            ugc: link.ugc,
          })));
        }

        // Store external links
        if (parsedPage.externalLinks && parsedPage.externalLinks.length > 0) {
          await db.insert(externalLinks).values(parsedPage.externalLinks.map(link => ({
            pagereportId: pageReportId,
            crawlId,
            url: link.url,
            scheme: link.scheme || null,
            rel: link.rel,
            text: link.text,
            urlHash: this.generateHash(link.url),
            nofollow: link.nofollow,
            sponsored: link.sponsored,
            ugc: link.ugc,
          })));
        }

        // Store images
        if (parsedPage.images && parsedPage.images.length > 0) {
          await db.insert(images).values(parsedPage.images.map(img => ({
            pagereportId: pageReportId,
            crawlId,
            url: img.url,
            alt: img.alt,
          })));
        }

        // Store scripts
        if (parsedPage.scripts && parsedPage.scripts.length > 0) {
          await db.insert(scripts).values(parsedPage.scripts.map(script => ({
            pagereportId: pageReportId,
            crawlId,
            url: script.url,
          })));
        }

        // Store styles
        if (parsedPage.styles && parsedPage.styles.length > 0) {
          await db.insert(styles).values(parsedPage.styles.map(style => ({
            pagereportId: pageReportId,
            crawlId,
            url: style.url,
          })));
        }

        // Store videos
        if (parsedPage.videos && parsedPage.videos.length > 0) {
          await db.insert(videos).values(parsedPage.videos.map(video => ({
            pagereportId: pageReportId,
            crawlId,
            url: video.url,
            poster: video.poster,
          })));
        }
      }
    } catch (error) {
      console.error('Error handling response:', error);
    }
  }

  private async analyzeIssues(crawlId: number): Promise<void> {
    try {
      // Get all page reports for this crawl
      const reports = await db.query.pageReports.findMany({
        where: eq(pageReports.crawlId, crawlId),
      });

      const analyzer = new IssueAnalyzer();
      
      for (const report of reports) {
        const foundIssues = analyzer.analyze(report as any);
        
        // Create issue records
        if (foundIssues.length > 0) {
          await db.insert(issues).values(foundIssues.map(issueTypeId => ({
            pagereportId: report.id,
            crawlId,
            issueTypeId,
          })));
        }
      }

      // Update total issues count
      const result = await db.select({ value: count() }).from(issues).where(eq(issues.crawlId, crawlId));
      const totalIssuesCount = result[0].value;
      
      await db.update(crawls)
        .set({ totalIssues: totalIssuesCount, issuesEnd: new Date() })
        .where(eq(crawls.id, crawlId));

    } catch (error) {
      console.error('Error analyzing issues:', error);
    }
  }

  private generateHash(input: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}

// Singleton instance
export const crawlerService = new CrawlerService();
