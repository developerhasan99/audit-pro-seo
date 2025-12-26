import axios from 'axios';
import { parseStringPromise } from 'xml2js';


export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export class SitemapChecker {
  private sitemapUrls: Set<string> = new Set();
  private exists: boolean = false;

  async fetch(sitemapUrl: string): Promise<void> {
    try {
      const response = await axios.get(sitemapUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'AuditProSEO/1.0 (+https://auditproseo.com)',
        },
      });

      if (response.status === 200 && response.data) {
        this.exists = true;
        await this.parseSitemap(response.data, sitemapUrl);
      }
    } catch (error) {
      this.exists = false;
    }
  }

  private async parseSitemap(content: string, _baseUrl: string): Promise<void> {
    try {
      const result = await parseStringPromise(content);

      // Check if it's a sitemap index
      if (result.sitemapindex && result.sitemapindex.sitemap) {
        const sitemaps = Array.isArray(result.sitemapindex.sitemap)
          ? result.sitemapindex.sitemap
          : [result.sitemapindex.sitemap];

        for (const sitemap of sitemaps) {
          if (sitemap.loc && sitemap.loc[0]) {
            // Recursively fetch nested sitemaps
            await this.fetch(sitemap.loc[0]);
          }
        }
      }

      // Check if it's a regular sitemap
      if (result.urlset && result.urlset.url) {
        const urls = Array.isArray(result.urlset.url)
          ? result.urlset.url
          : [result.urlset.url];

        for (const url of urls) {
          if (url.loc && url.loc[0]) {
            this.sitemapUrls.add(url.loc[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing sitemap:', error);
    }
  }

  getUrls(): string[] {
    return Array.from(this.sitemapUrls);
  }

  hasUrl(url: string): boolean {
    return this.sitemapUrls.has(url);
  }

  sitemapExists(): boolean {
    return this.exists;
  }

  size(): number {
    return this.sitemapUrls.size;
  }
}
