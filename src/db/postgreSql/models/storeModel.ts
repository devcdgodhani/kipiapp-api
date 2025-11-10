import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { COMMON_STATUS, POSTGRE_SQL_MODEL } from '../../../constants';
import { IStoreAttributes } from '../../../interfaces';
import { TStoreCreate } from '../../../types';

export class StoreModel extends Model<IStoreAttributes, TStoreCreate> implements IStoreAttributes {
  declare id: string;
  declare title: string;
  declare enTitle: string;
  declare userId: string;
  declare status: COMMON_STATUS;

  declare createdBy?: string;
  declare updatedBy?: string;
  declare deletedBy?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { UserModel } = models;

    // Each store belongs to a user
    StoreModel.belongsTo(UserModel, {
      foreignKey: { name: 'userId', allowNull: true },
      as: POSTGRE_SQL_MODEL.STORES.ASSOCIATIONS.USER,
    });

    // A user can have many stores
    UserModel.hasMany(StoreModel, {
      foreignKey: { name: 'userId', allowNull: true },
      sourceKey: 'id',
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.STORE_LIST,
    });
  }
}

StoreModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    enTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(COMMON_STATUS)],
      },
      defaultValue: COMMON_STATUS.ACTIVE,
    },
  },
  {
    sequelize,
    tableName: POSTGRE_SQL_MODEL.STORES.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.STORES.MODEL_NAME,
  }
);
