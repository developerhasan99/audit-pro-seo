import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  lang?: string;
  theme?: string;
  deleting?: boolean;
  created?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'lang' | 'theme' | 'deleting' | 'created'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public lang?: string;
  public theme?: string;
  public deleting?: boolean;
  public created?: Date;

  // Method to compare password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to hash password before saving
  public async hashPassword(): Promise<void> {
    if (this.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'en',
    },
    theme: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'light',
    },
    deleting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        await user.hashPassword();
      },
    },
  }
);

export default User;
