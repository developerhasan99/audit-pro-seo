import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface ScriptAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  url: string;
}

interface ScriptCreationAttributes extends Optional<ScriptAttributes, 'id'> {}

export class Script extends Model<ScriptAttributes, ScriptCreationAttributes> implements ScriptAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public url!: string;
}

Script.init(
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
    tableName: 'scripts',
    timestamps: false,
  }
);

export default Script;
