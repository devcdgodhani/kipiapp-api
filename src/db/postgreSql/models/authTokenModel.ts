import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, TOKEN_TYPE } from '../../../constants';
import { IAuthTokenAttributes } from '../../../interfaces';
import { TAuthTokenCreate } from '../../../types';

export class AuthTokenModel
  extends Model<IAuthTokenAttributes, TAuthTokenCreate>
  implements IAuthTokenAttributes
{
  declare id: string;
  declare token: string;
  declare type: TOKEN_TYPE;
  declare userId: string;
  declare expiredAt: number;
  declare referenceTokenId: string;

  declare createdBy: string;
  declare updatedBy: string;
  declare deletedBy: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { AuthTokenModel, UserModel } = models;

    AuthTokenModel.belongsTo(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_TOKENS.ASSOCIATIONS.USER,
    });

    UserModel.hasMany(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_TOKENS.ASSOCIATIONS.USER_TOKEN_LIST,
    });

    AuthTokenModel.belongsTo(AuthTokenModel, {
      foreignKey: { name: 'referenceTokenId', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_TOKENS.ASSOCIATIONS.REFERENCE_TOKEN,
    });
  }
}

AuthTokenModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(TOKEN_TYPE)],
      },
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    referenceTokenId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: POSTGRE_SQL_MODEL.AUTH_TOKENS.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.AUTH_TOKENS.MODEL_NAME,
  }
);
