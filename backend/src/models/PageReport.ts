import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface PageReportAttributes {
  id: number;
  crawlId: number;
  url: string;
  scheme?: string;
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
  words?: number;
  size?: number;
  urlHash: string;
  redirectHash?: string;
  blockedByRobotstxt?: boolean;
  crawled?: boolean;
  inSitemap?: boolean;
  depth?: number;
  bodyHash?: string;
  timeout?: boolean;
  ttfb?: number;
}

interface PageReportCreationAttributes extends Optional<PageReportAttributes, 'id' | 'scheme' | 'redirectUrl' | 'refresh' | 'contentType' | 'mediaType' | 'lang' | 'title' | 'description' | 'robots' | 'canonical' | 'h1' | 'h2' | 'words' | 'size' | 'redirectHash' | 'blockedByRobotstxt' | 'crawled' | 'inSitemap' | 'depth' | 'bodyHash' | 'timeout' | 'ttfb'> {}

class PageReport extends Model<PageReportAttributes, PageReportCreationAttributes> implements PageReportAttributes {
  public id!: number;
  public crawlId!: number;
  public url!: string;
  public scheme?: string;
  public redirectUrl?: string;
  public refresh?: string;
  public statusCode!: number;
  public contentType?: string;
  public mediaType?: string;
  public lang?: string;
  public title?: string;
  public description?: string;
  public robots?: string;
  public canonical?: string;
  public h1?: string;
  public h2?: string;
  public words?: number;
  public size?: number;
  public urlHash!: string;
  public redirectHash?: string;
  public blockedByRobotstxt?: boolean;
  public crawled?: boolean;
  public inSitemap?: boolean;
  public depth?: number;
  public bodyHash?: string;
  public timeout?: boolean;
  public ttfb?: number;
}

PageReport.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    crawlId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'crawl_id',
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    scheme: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    redirectUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      field: 'redirect_url',
    },
    refresh: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status_code',
    },
    contentType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'content_type',
    },
    mediaType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'media_type',
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    robots: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    canonical: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    h1: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    h2: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    words: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    urlHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'url_hash',
    },
    redirectHash: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'redirect_hash',
    },
    blockedByRobotstxt: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'blocked_by_robotstxt',
    },
    crawled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    inSitemap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'in_sitemap',
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bodyHash: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'body_hash',
    },
    timeout: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ttfb: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'pagereports',
    timestamps: false,
  }
);

export default PageReport;
