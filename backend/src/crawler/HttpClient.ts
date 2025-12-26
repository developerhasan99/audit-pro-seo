import axios, { AxiosInstance, AxiosResponse } from 'axios';


export interface HttpClientResponse {
  response: AxiosResponse;
  ttfb: number; // Time to first byte in milliseconds
}

export interface HttpClientOptions {
  userAgent?: string;
  timeout?: number;
  maxRedirects?: number;
  basicAuth?: {
    username: string;
    password: string;
  };
}

export class HttpClient {
  private client: AxiosInstance;
  private userAgent: string;

  constructor(options: HttpClientOptions = {}) {
    this.userAgent = options.userAgent || 'AuditProSEO/1.0 (+https://auditproseo.com)';
    
    this.client = axios.create({
      timeout: options.timeout || 30000,
      maxRedirects: options.maxRedirects || 5,
      validateStatus: () => true, // Don't throw on any status code
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      ...(options.basicAuth && {
        auth: {
          username: options.basicAuth.username,
          password: options.basicAuth.password,
        },
      }),
    });
  }

  async get(url: string): Promise<HttpClientResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.client.get(url);
      const ttfb = Date.now() - startTime;
      
      return { response, ttfb };
    } catch (error: any) {
      // Handle timeout and network errors

      
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  async head(url: string): Promise<HttpClientResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.client.head(url);
      const ttfb = Date.now() - startTime;
      
      return { response, ttfb };
    } catch (error: any) {

      
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  getUserAgent(): string {
    return this.userAgent;
  }
}
