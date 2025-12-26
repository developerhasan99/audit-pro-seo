import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface CrawlAttributes {
  id: number;
  projectId: number;
  start: Date;
  end?: Date;
  totalUrls?: number;
  totalIssues?: number;
  issuesEnd?: Date;
  robotstxtExists?: boolean;
  sitemapExists?: boolean;
  sitemapIsBlocked?: boolean;
  crawled?: number;
}

interface CrawlCreationAttributes extends Optional<CrawlAttributes, 'id' | 'end' | 'totalUrls' | 'totalIssues' | 'issuesEnd' | 'robotstxtExists' | 'sitemapExists' | 'sitemapIsBlocked' | 'crawled'> {}

class Crawl extends Model<CrawlAttributes, CrawlCreationAttributes> implements CrawlAttributes {
  public id!: number;
  public projectId!: number;
  public start!: Date;
  public end?: Date;
  public totalUrls?: number;
  public totalIssues?: number;
  public issuesEnd?: Date;
  public robotstxtExists?: boolean;
  public sitemapExists?: boolean;
  public sitemapIsBlocked?: boolean;
  public crawled?: number;
}

Crawl.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'project_id',
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalUrls: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_urls',
    },
    totalIssues: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_issues',
    },
    issuesEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'issues_end',
    },
    robotstxtExists: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'robotstxt_exists',
    },
    sitemapExists: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'sitemap_exists',
    },
    sitemapIsBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'sitemap_is_blocked',
    },
    crawled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'crawls',
    timestamps: false,
  }
);

export default Crawl;
