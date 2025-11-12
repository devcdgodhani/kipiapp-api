import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, PRODUCT_LOT_TYPE } from '../../../constants';
import { IProductLotAttributes } from '../../../interfaces';
import { TProductLotCreate } from '../../../types';

export class ProductLotModel
  extends Model<IProductLotAttributes, TProductLotCreate>
  implements IProductLotAttributes
{
  declare id: string;
  declare title: string;
  declare enTitle: string;
  declare sequence: number;
  declare storeId: string;
  declare amount: number;
  declare vendorId: string;
  declare type: PRODUCT_LOT_TYPE;
  declare parentLotId: string;
  declare date: Date;

  declare createdBy?: string;
  declare updatedBy?: string;
  declare deletedBy?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { ProductLotModel, StoreModel, UserModel } = models;

    // ProductLot belongs to a Store
    ProductLotModel.belongsTo(StoreModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.PRODUCT_LOTS.ASSOCIATIONS.STORE,
    });

    // Store has many ProductLots
    StoreModel.hasMany(ProductLotModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.STORES.ASSOCIATIONS.PRODUCT_LOT_LIST,
    });

    // ProductLot belongs to a Parent ProductLot
    ProductLotModel.belongsTo(ProductLotModel, {
      foreignKey: { name: 'parentLotId', allowNull: true },
      as: POSTGRE_SQL_MODEL.PRODUCT_LOTS.ASSOCIATIONS.PARENT_LOT,
    });

    // ProductLots has many Child ProductLots
    ProductLotModel.hasMany(ProductLotModel, {
      foreignKey: { name: 'parentLotId', allowNull: true },
      as: POSTGRE_SQL_MODEL.PRODUCT_LOTS.ASSOCIATIONS.CHILD_LOT_LIST,
    });

    // ProductLot belongs to a User(vendor)
    ProductLotModel.belongsTo(UserModel, {
      foreignKey: { name: 'vendorId', allowNull: true },
      as: POSTGRE_SQL_MODEL.PRODUCT_LOTS.ASSOCIATIONS.VENDOR,
    });

    //  User(vendor) has many ProductLots
    UserModel.hasMany(ProductLotModel, {
      foreignKey: { name: 'vendorId', allowNull: true },
      as: POSTGRE_SQL_MODEL.USERS.ASSOCIATIONS.PRODUCT_LOT_LIST,
    });
  }
}

ProductLotModel.init(
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
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [Object.values(PRODUCT_LOT_TYPE)],
      },
      allowNull: false,
    },
    parentLotId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
  },
  {
    sequelize,
    tableName: POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.PRODUCT_LOTS.MODEL_NAME,
  }
);
