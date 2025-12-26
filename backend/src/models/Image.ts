import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface ImageAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
  alt?: string;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id' | 'alt'> {}

export class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
  public alt?: string;
}

Image.init(
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
    alt: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'images',
    timestamps: false,
  }
);

export default Image;
