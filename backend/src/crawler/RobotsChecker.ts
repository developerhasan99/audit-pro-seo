import robotsParser from 'robots-parser';
import { HttpClient } from './HttpClient';

export class RobotsChecker {
  private robots: any;
  private userAgent: string;
  private robotsUrl: string;
  private exists: boolean = false;

  constructor(baseUrl: string, userAgent: string) {
    this.userAgent = userAgent;
    const url = new URL(baseUrl);
    this.robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
  }

  async fetch(httpClient: HttpClient): Promise<void> {
    try {
      const { response } = await httpClient.get(this.robotsUrl);
      
      if (response.status === 200 && response.data) {
        this.exists = true;
        this.robots = robotsParser(this.robotsUrl, response.data);
      } else {
        this.exists = false;
        // Create a permissive robots.txt parser
        this.robots = robotsParser(this.robotsUrl, 'User-agent: *\nAllow: /');
      }
    } catch (error) {
      this.exists = false;
      // Create a permissive robots.txt parser
      this.robots = robotsParser(this.robotsUrl, 'User-agent: *\nAllow: /');
    }
  }

  isAllowed(url: string): boolean {
    if (!this.robots) {
      return true;
    }
    
    return this.robots.isAllowed(url, this.userAgent) ?? true;
  }

  getSitemaps(): string[] {
    if (!this.robots) {
      return [];
    }
    
    return this.robots.getSitemaps() || [];
  }

  robotsExists(): boolean {
    return this.exists;
  }
}
