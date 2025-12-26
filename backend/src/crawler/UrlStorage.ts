import { URL } from 'url';

export class UrlStorage {
  private visited: Set<string>;

  constructor() {
    this.visited = new Set();
  }

  add(url: string | URL): void {
    const urlString = typeof url === 'string' ? url : url.href;
    this.visited.add(this.normalize(urlString));
  }

  has(url: string | URL): boolean {
    const urlString = typeof url === 'string' ? url : url.href;
    return this.visited.has(this.normalize(urlString));
  }

  size(): number {
    return this.visited.size;
  }

  clear(): void {
    this.visited.clear();
  }

  private normalize(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove trailing slash from pathname
      let pathname = parsed.pathname;
      if (pathname.endsWith('/') && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
      }
      
      // Normalize the URL
      return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}${parsed.hash}`;
    } catch (error) {
      return url;
    }
  }
}
