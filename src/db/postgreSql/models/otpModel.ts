import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, OTP_TYPE, TOKEN_TYPE } from '../../../constants';
import { IOtpAttributes } from '../../../interfaces';
import { TOtpCreate } from '../../../types';

export class OtpModel extends Model<IOtpAttributes, TOtpCreate> implements IOtpAttributes {
  declare id: string;
  declare code: string;
  declare type: OTP_TYPE;
  declare generateTokens: TOKEN_TYPE[];
  declare userId: string;
  declare expiredAt: number;
  declare maxUses: number;
  declare usesCount: number;

  declare createdBy: string;
  declare updatedBy: string;
  declare deletedBy: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { OtpModel, UserModel } = models;

    OtpModel.belongsTo(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.OTPS.ASSOCIATIONS.USER,
    });

    UserModel.hasMany(OtpModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.OTP_LIST,
    });
  }
}

OtpModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [Object.values(OTP_TYPE)],
      },
    },
    generateTokens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    usesCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: POSTGRE_SQL_MODEL.OTPS.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.OTPS.MODEL_NAME,
  }
);
