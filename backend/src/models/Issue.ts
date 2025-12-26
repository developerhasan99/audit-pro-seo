import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

// IssueType Model
interface IssueTypeAttributes {
  id: number;
  type: string;
  priority: number;
}

interface IssueTypeCreationAttributes extends Optional<IssueTypeAttributes, 'id'> {}

export class IssueType extends Model<IssueTypeAttributes, IssueTypeCreationAttributes> implements IssueTypeAttributes {
  public id!: number;
  public type!: string;
  public priority!: number;
}

IssueType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'issue_types',
    timestamps: false,
  }
);

// Issue Model
interface IssueAttributes {
  id: number;
  pagereportId: number;
  crawlId: number;
  issueTypeId: number;
}

interface IssueCreationAttributes extends Optional<IssueAttributes, 'id'> {}

export class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  public id!: number;
  public pagereportId!: number;
  public crawlId!: number;
  public issueTypeId!: number;
}

Issue.init(
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
    issueTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'issue_type_id',
    },
  },
  {
    sequelize,
    tableName: 'issues',
    timestamps: false,
  }
);

// Issue type constants
export const IssueTypes = {
  ERROR_30X: 1,
  ERROR_40X: 2,
  ERROR_50X: 3,
  ERROR_DUPLICATED_TITLE: 4,
  ERROR_DUPLICATED_DESCRIPTION: 5,
  ERROR_EMPTY_TITLE: 6,
  ERROR_SHORT_TITLE: 7,
  ERROR_LONG_TITLE: 8,
  ERROR_EMPTY_DESCRIPTION: 9,
  ERROR_SHORT_DESCRIPTION: 10,
  ERROR_LONG_DESCRIPTION: 11,
  ERROR_LITTLE_CONTENT: 12,
  ERROR_IMAGES_NO_ALT: 13,
  ERROR_REDIRECT_CHAIN: 14,
  ERROR_NO_H1: 15,
  ERROR_NO_LANG: 16,
  ERROR_HTTP_LINKS: 17,
  ERROR_HREFLANG_RETURN: 18,
  ERROR_TOO_MANY_LINKS: 19,
  ERROR_INTERNAL_NOFOLLOW: 20,
  ERROR_EXTERNAL_WITHOUT_NOFOLLOW: 21,
  ERROR_CANONICALIZED_NON_CANONICAL: 22,
  ERROR_REDIRECT_LOOP: 23,
  ERROR_NOT_VALID_HEADINGS: 24,
} as const;

export default Issue;
