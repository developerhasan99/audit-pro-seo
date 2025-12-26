import * as cheerio from 'cheerio';
import { URL } from 'url';
import crypto from 'crypto';

export interface ParsedPage {
  url: string;
  scheme: string;
  redirectUrl?: string;
  refresh?: string;
  statusCode: number;
  contentType?: string;
  mediaType?: string;
  lang?: string;
  title?: string;
  description?: string;
  robots?: string;
  canonical?: string;
  h1?: string;
  h2?: string;
  words: number;
  size: number;
  urlHash: string;
  redirectHash?: string;
  links: ParsedLink[];
  externalLinks: ParsedLink[];
  images: ParsedImage[];
  scripts: ParsedScript[];
  styles: ParsedStyle[];
  iframes: string[];

  audios: string[];
  videos: ParsedVideo[];
  hreflangs: ParsedHreflang[];
  bodyHash?: string;
}

export interface ParsedLink {
  url: string;
  scheme: string;
  text?: string;
  rel?: string;
  nofollow: boolean;
  sponsored: boolean;
  ugc: boolean;
}

export interface ParsedImage {
  url: string;
  alt?: string;
}

export interface ParsedScript {
  url: string;
}

export interface ParsedStyle {
  url: string;
}

export interface ParsedVideo {
  url: string;
  poster?: string;
}

export interface ParsedHreflang {
  fromLang?: string;
  toUrl: string;
  toLang?: string;
}


export class HtmlParser {
  static parse(html: string, url: string, statusCode: number, headers: any): ParsedPage {
    const $ = cheerio.load(html);
    const parsedUrl = new URL(url);

    // Extract basic metadata
    const title = $('title').first().text().trim() || undefined;
    const description = $('meta[name="description"]').attr('content')?.trim() || undefined;
    const robots = $('meta[name="robots"]').attr('content')?.trim() || undefined;
    const canonical = $('link[rel="canonical"]').attr('href') || undefined;
    const lang = $('html').attr('lang') || undefined;

    // Extract headings
    const h1 = $('h1').first().text().trim() || undefined;
    const h2 = $('h2').first().text().trim() || undefined;

    // Extract refresh meta tag
    const refresh = $('meta[http-equiv="refresh"]').attr('content') || undefined;

    // Count words in body
    const bodyText = $('body').text();
    const words = bodyText.split(/\s+/).filter(word => word.length > 0).length;

    // Calculate size
    const size = Buffer.byteLength(html, 'utf8');

    // Generate hashes
    const urlHash = this.generateHash(url);
    const bodyHash = this.generateHash(bodyText);

    // Extract links
    const links: ParsedLink[] = [];
    const externalLinks: ParsedLink[] = [];
    
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      try {
        const linkUrl = new URL(href, url);
        const rel = $(elem).attr('rel');
        const nofollow = rel?.includes('nofollow') || false;
        const sponsored = rel?.includes('sponsored') || false;
        const ugc = rel?.includes('ugc') || false;
        const text = $(elem).text().trim();

        const link: ParsedLink = {
          url: linkUrl.href,
          scheme: linkUrl.protocol.replace(':', ''),
          text: text || undefined,
          rel: rel || undefined,
          nofollow,
          sponsored,
          ugc,
        };

        // Check if internal or external
        if (linkUrl.hostname === parsedUrl.hostname) {
          links.push(link);
        } else {
          externalLinks.push(link);
        }
      } catch (error) {
        // Invalid URL, skip
      }
    });

    // Extract images
    const images: ParsedImage[] = [];
    $('img[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (!src) return;

      try {
        const imgUrl = new URL(src, url);
        images.push({
          url: imgUrl.href,
          alt: $(elem).attr('alt')?.trim() || undefined,
        });
      } catch (error) {
        // Invalid URL, skip
      }
    });

    // Extract scripts
    const scripts: ParsedScript[] = [];
    $('script[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        try {
          const scriptUrl = new URL(src, url);
          scripts.push({ url: scriptUrl.href });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    // Extract stylesheets
    const styles: ParsedStyle[] = [];
    $('link[rel="stylesheet"][href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        try {
          const styleUrl = new URL(href, url);
          styles.push({ url: styleUrl.href });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });


    // Extract iframes
    const iframes: string[] = [];
    $('iframe[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        try {
          const iframeUrl = new URL(src, url);
          iframes.push(iframeUrl.href);
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    // Extract audio
    const audios: string[] = [];
    $('audio[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        try {
          const audioUrl = new URL(src, url);
          audios.push(audioUrl.href);
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    // Extract videos
    const videos: ParsedVideo[] = [];
    $('video[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        try {
          const videoUrl = new URL(src, url);
          videos.push({
            url: videoUrl.href,
            poster: $(elem).attr('poster') || undefined,
          });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    // Extract hreflang
    const hreflangs: ParsedHreflang[] = [];
    $('link[rel="alternate"][hreflang]').each((_, elem) => {
      const href = $(elem).attr('href');
      const hreflang = $(elem).attr('hreflang');
      
      if (href && hreflang) {
        try {
          const hreflangUrl = new URL(href, url);
          hreflangs.push({
            fromLang: lang,
            toUrl: hreflangUrl.href,
            toLang: hreflang,
          });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    // Get content type and media type
    const contentType = headers['content-type'] || undefined;
    const mediaType = contentType?.split(';')[0].trim() || undefined;

    return {
      url,
      scheme: parsedUrl.protocol.replace(':', ''),
      statusCode,
      contentType,
      mediaType,
      lang,
      title,
      description,
      robots,
      canonical,
      h1,
      h2,
      refresh,
      words,
      size,
      urlHash,
      bodyHash,
      links,
      externalLinks,
      images,
      scripts,
      styles,
      iframes,
      audios,
      videos,
      hreflangs,
    };
  }

  private static generateHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}
