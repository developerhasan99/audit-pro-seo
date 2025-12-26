import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface LinkAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
  scheme: string;
  rel?: string;
  text?: string;
  urlHash: string;
  nofollow: boolean;
  sponsored: boolean;
  ugc: boolean;
  statusCode?: number;
}

interface LinkCreationAttributes extends Optional<LinkAttributes, 'id' | 'rel' | 'text' | 'statusCode'> {}

export class Link extends Model<LinkAttributes, LinkCreationAttributes> implements LinkAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
  public scheme!: string;
  public rel?: string;
  public text?: string;
  public urlHash!: string;
  public nofollow!: boolean;
  public sponsored!: boolean;
  public ugc!: boolean;
  public statusCode?: number;
}

Link.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pagereportId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'pagereport_id',
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
      allowNull: false,
    },
    rel: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    urlHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'url_hash',
    },
    nofollow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sponsored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ugc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status_code',
    },
  },
  {
    sequelize,
    tableName: 'links',
    timestamps: false,
  }
);

// External Link Model
interface ExternalLinkAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
  scheme: string;
  rel?: string;
  text?: string;
  urlHash: string;
  nofollow: boolean;
  sponsored: boolean;
  ugc: boolean;
  statusCode?: number;
}

interface ExternalLinkCreationAttributes extends Optional<ExternalLinkAttributes, 'id' | 'rel' | 'text' | 'statusCode'> {}

export class ExternalLink extends Model<ExternalLinkAttributes, ExternalLinkCreationAttributes> implements ExternalLinkAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
  public scheme!: string;
  public rel?: string;
  public text?: string;
  public urlHash!: string;
  public nofollow!: boolean;
  public sponsored!: boolean;
  public ugc!: boolean;
  public statusCode?: number;
}

ExternalLink.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pagereportId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'pagereport_id',
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
    urlHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'url_hash',
    },
    rel: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    nofollow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sponsored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ugc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status_code',
    },
  },

  {
    sequelize,
    tableName: 'external_links',
    timestamps: false,
  }
);
