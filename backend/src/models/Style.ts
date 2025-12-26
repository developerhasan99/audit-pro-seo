import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface StyleAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
}

interface StyleCreationAttributes extends Optional<StyleAttributes, 'id'> {}

export class Style extends Model<StyleAttributes, StyleCreationAttributes> implements StyleAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
}

Style.init(
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
  },
  {
    sequelize,
    tableName: 'styles',
    timestamps: false,
  }
);

export default Style;
