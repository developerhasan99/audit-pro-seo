import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface VideoAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
  poster?: string;
}

interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'poster'> {}

export class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
  public poster?: string;
}

Video.init(
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
    poster: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'videos',
    timestamps: false,
  }
);

export default Video;
