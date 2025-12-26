import { URL } from 'url';
import crypto from 'crypto';

export class UrlUtils {
  /**
   * Normalize a URL by removing trailing slash (unless it's just /)
   * and sorting query parameters.
   */
  public static normalize(urlString: string): string {
    try {
      const url = new URL(urlString);
      
      // Remove default ports
      if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) {
        url.port = '';
      }

      // Sort query parameters
      url.searchParams.sort();

      // Lowercase hostname
      url.hostname = url.hostname.toLowerCase();

      // Remove trailing slash if not root
      let path = url.pathname;
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      url.pathname = path;

      return url.toString();
    } catch (error) {
      return urlString;
    }
  }

  /**
   * Check if a URL is valid
   */
  public static isValid(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a hash for a URL
   */
  public static generateHash(urlString: string): string {
    const normalized = this.normalize(urlString);
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Check if a URL is internal to the base URL
   */
  public static isInternal(urlString: string, baseUrl: string): boolean {
    try {
      const url = new URL(urlString);
      const base = new URL(baseUrl);
      return url.hostname === base.hostname || url.hostname.endsWith(`.${base.hostname}`);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get domain from URL
   */
  public static getDomain(urlString: string): string {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      return '';
    }
  }
}
