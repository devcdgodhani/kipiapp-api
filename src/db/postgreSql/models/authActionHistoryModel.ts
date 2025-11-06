import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, AUTH_ACTION_TYPE } from '../../../constants';
import { IAuthActionHistoryAttributes } from '../../../interfaces';
import { TAuthActionHistoryCreate } from '../../../types';

export class AuthActionHistoryModel
  extends Model<IAuthActionHistoryAttributes, TAuthActionHistoryCreate>
  implements IAuthActionHistoryAttributes
{
  declare id: string;
  declare userId: string;
  declare type: AUTH_ACTION_TYPE;
  declare actionAt: number;
  declare deviceId: string;
  declare deviceIp: boolean;

  declare createdBy: string;
  declare updatedBy: string;
  declare deletedBy: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate = (models: Record<string, ModelStatic<Model>>) => {
    const { UserModel } = models;

    AuthActionHistoryModel.belongsTo(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.ASSOCIATIONS.USER,
    });

    UserModel.hasMany(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.ASSOCIATIONS.USER_ACTION_LIST,
    });

    AuthActionHistoryModel.belongsTo(UserModel, {
      foreignKey: { name: 'createdBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.ASSOCIATIONS.CREATED_BY,
    });

    AuthActionHistoryModel.belongsTo(UserModel, {
      foreignKey: { name: 'updatedBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.ASSOCIATIONS.UPDATED_BY,
    });

    AuthActionHistoryModel.belongsTo(UserModel, {
      foreignKey: { name: 'deletedBy', allowNull: true },
      as: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.ASSOCIATIONS.DELETED_BY,
    });
  };
}

AuthActionHistoryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(AUTH_ACTION_TYPE)),
      allowNull: true,
    },
    actionAt: {
      type: DataTypes.BIGINT, // stores timestamp as number
      allowNull: true,
    },
    deviceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deviceIp: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'auth_action_histories',
    modelName: POSTGRE_SQL_MODEL.AUTH_ACTION_HISTORIES.MODEL_NAME,
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
