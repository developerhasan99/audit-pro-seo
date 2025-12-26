import { Crawler, CrawlerOptions, ResponseMessage } from '../crawler/Crawler';
import { Project, Crawl, PageReport, Issue, Link, ExternalLink, Image, Video, Script, Style } from '../models';
import { IssueAnalyzer } from './issues/IssueAnalyzer';
import { Broker, EventType } from '../websocket/broker';

export class CrawlerService {
  private activeCrawlers: Map<number, Crawler> = new Map();

  async startCrawl(projectId: number): Promise<number> {
    // Get project
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if already crawling
    if (this.activeCrawlers.has(projectId)) {
      throw new Error('Crawl already in progress for this project');
    }

    // Create crawl record
    const crawl = await Crawl.create({
      projectId,
      start: new Date(),
    });

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
      await this.handleResponse(crawl.id, response);
      
      // Publish progress
      const status = crawler.getStatus();
      Broker.publish(EventType.CRAWL_PROGRESS, {
        projectId,
        crawlId: crawl.id,
        ...status,
        lastUrl: response.url.href,
      });
    });

    crawler.on('complete', async (status) => {
      // Update crawl record
      await crawl.update({
        end: new Date(),
        totalUrls: status.crawled,
        robotstxtExists: crawler.robotstxtExists(),
        sitemapExists: crawler.sitemapExists(),
      });

      // Analyze issues
      await this.analyzeIssues(crawl.id);

      // Publish completion
      Broker.publish(EventType.CRAWL_COMPLETED, {
        projectId,
        crawlId: crawl.id,
        status,
      });

      // Remove from active crawlers
      this.activeCrawlers.delete(projectId);
    });

    crawler.on('error', (error) => {
      console.error('Crawler error:', error);
      Broker.publish(EventType.CRAWL_STOPPED, {
        projectId,
        crawlId: crawl.id,
        error: error.message,
      });
      this.activeCrawlers.delete(projectId);
    });

    // Publish start
    Broker.publish(EventType.CRAWL_STARTED, {
      projectId,
      crawlId: crawl.id,
    });

    // Start crawling
    crawler.start().catch(error => {
      console.error('Crawler start error:', error);
    });

    return crawl.id;
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
        const pr = await PageReport.create({
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
        });
        pageReportId = pr.id;
      } else {
        // Create page report
        const pageReport = await PageReport.create({
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
        });
        pageReportId = pageReport.id;

        // Store links
        if (parsedPage.links) {
          for (const link of parsedPage.links) {
            await Link.create({
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
            });
          }
        }

        // Store external links
        if (parsedPage.externalLinks) {
          for (const link of parsedPage.externalLinks) {
            await ExternalLink.create({
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
            });
          }
        }

        // Store images
        if (parsedPage.images) {
          for (const img of parsedPage.images) {
            await Image.create({
              pagereportId: pageReportId,
              crawlId,
              url: img.url,
              alt: img.alt,
            });
          }
        }

        // Store scripts
        if (parsedPage.scripts) {
          for (const script of parsedPage.scripts) {
            await Script.create({
              pagereportId: pageReportId,
              crawlId,
              url: script.url,
            });
          }
        }

        // Store styles
        if (parsedPage.styles) {
          for (const style of parsedPage.styles) {
            await Style.create({
              pagereportId: pageReportId,
              crawlId,
              url: style.url,
            });
          }
        }

        // Store videos
        if (parsedPage.videos) {
          for (const video of parsedPage.videos) {
            await Video.create({
              pagereportId: pageReportId,
              crawlId,
              url: video.url,
              poster: video.poster,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error handling response:', error);
    }
  }



  private async analyzeIssues(crawlId: number): Promise<void> {
    try {
      // Get all page reports for this crawl
      const pageReports = await PageReport.findAll({
        where: { crawlId },
      });

      const analyzer = new IssueAnalyzer();
      
      for (const pageReport of pageReports) {
        const issues = analyzer.analyze(pageReport);
        
        // Create issue records
        for (const issueTypeId of issues) {
          await Issue.create({
            pagereportId: pageReport.id,
            crawlId,
            issueTypeId,
          });
        }
      }

      // Update total issues count
      const totalIssues = await Issue.count({ where: { crawlId } });
      await Crawl.update(
        { totalIssues, issuesEnd: new Date() },
        { where: { id: crawlId } }
      );

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
