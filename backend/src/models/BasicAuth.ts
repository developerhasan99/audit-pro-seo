import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface BasicAuthAttributes {
  id: number;
  projectId: number;
  authUser: string;
  authPass: string;
}

interface BasicAuthCreationAttributes extends Optional<BasicAuthAttributes, 'id'> {}

export class BasicAuth extends Model<BasicAuthAttributes, BasicAuthCreationAttributes> implements BasicAuthAttributes {
  public id!: number;
  public projectId!: number;
  public authUser!: string;
  public authPass!: string;
}

BasicAuth.init(
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
    authUser: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'auth_user',
    },
    authPass: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'auth_pass',
    },
  },
  {
    sequelize,
    tableName: 'basic_auth',
    timestamps: false,
  }
);

export default BasicAuth;
