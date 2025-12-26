import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface ProjectAttributes {
  id: number;
  userId: number;
  url: string;
  created?: Date;
  ignoreRobotstxt?: boolean;
  followNofollow?: boolean;
  includeNoindex?: boolean;
  crawlSitemap?: boolean;
  allowSubdomains?: boolean;
  deleting?: boolean;
  basicAuth?: boolean;
  checkExternalLinks?: boolean;
  archive?: boolean;
  userAgent?: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'created' | 'ignoreRobotstxt' | 'followNofollow' | 'includeNoindex' | 'crawlSitemap' | 'allowSubdomains' | 'deleting' | 'basicAuth' | 'checkExternalLinks' | 'archive' | 'userAgent'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public userId!: number;
  public url!: string;
  public created?: Date;
  public ignoreRobotstxt?: boolean;
  public followNofollow?: boolean;
  public includeNoindex?: boolean;
  public crawlSitemap?: boolean;
  public allowSubdomains?: boolean;
  public deleting?: boolean;
  public basicAuth?: boolean;
  public checkExternalLinks?: boolean;
  public archive?: boolean;
  public userAgent?: string;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ignoreRobotstxt: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'ignore_robotstxt',
    },
    followNofollow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'follow_nofollow',
    },
    includeNoindex: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'include_noindex',
    },
    crawlSitemap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'crawl_sitemap',
    },
    allowSubdomains: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'allow_subdomains',
    },
    deleting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    basicAuth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'basic_auth',
    },
    checkExternalLinks: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'check_external_links',
    },
    archive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userAgent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'user_agent',
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: false,
  }
);

export default Project;
