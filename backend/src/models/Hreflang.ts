import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface HreflangAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  fromLang?: string;
  toUrl: string;
  toLang?: string;
  fromHash: string;
  toHash: string;
}

interface HreflangCreationAttributes extends Optional<HreflangAttributes, 'id' | 'fromLang' | 'toLang'> {}

export class Hreflang extends Model<HreflangAttributes, HreflangCreationAttributes> implements HreflangAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public fromLang?: string;
  public toUrl!: string;
  public toLang?: string;
  public fromHash!: string;
  public toHash!: string;
}

Hreflang.init(
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
    fromLang: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'from_lang',
    },
    toUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      field: 'to_url',
    },
    toLang: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'to_lang',
    },
    fromHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'from_hash',
    },
    toHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'to_hash',
    },
  },
  {
    sequelize,
    tableName: 'hreflangs',
    timestamps: false,
  }
);

export default Hreflang;
