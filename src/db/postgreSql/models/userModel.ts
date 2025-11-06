import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import {
  USER_TYPE,
  GENDER,
  SIGN_UP_TYPE,
  USER_STATUS,
  POSTGRE_SQL_MODEL,
} from '../../../constants';
import { TUserCreationAttributes } from '../../../types';
import { IUserAttributes } from '../../../interfaces';

export class UserModel
  extends Model<IUserAttributes, TUserCreationAttributes>
  implements IUserAttributes
{
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare password: string;
  declare mobile: string;
  declare countryCode: string;
  declare email: string;
  declare type: USER_TYPE;
  declare gender: GENDER;
  declare signUpType: SIGN_UP_TYPE;
  declare isEmailVerified: boolean;
  declare isMobileVerified: boolean;
  declare isVerified: boolean;
  declare status: USER_STATUS;

  declare createdBy: string;
  declare updatedBy: string;
  declare deletedBy: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate = (models: Record<string, ModelStatic<Model>>) => {
    const { UserModel } = models;

    UserModel.belongsTo(UserModel, {
      foreignKey: { name: 'createdBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.CREATED_BY,
    });

    UserModel.belongsTo(UserModel, {
      foreignKey: { name: 'updatedBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.UPDATED_BY,
    });

    UserModel.belongsTo(UserModel, {
      foreignKey: { name: 'deletedBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.DELETED_BY,
    });
  };

  // static addHooks(models) {}
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [Object.values(USER_TYPE)],
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [Object.values(GENDER)],
      },
    },
    signUpType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: SIGN_UP_TYPE.APP,
      validate: {
        isIn: [Object.values(SIGN_UP_TYPE)],
      },
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: USER_STATUS.ACTIVE,
      validate: {
        isIn: [Object.values(USER_STATUS)],
      },
    },
  },
  {
    sequelize,
    tableName: POSTGRE_SQL_MODEL.USERS.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.USERS.MODEL_NAME,
  }
);
