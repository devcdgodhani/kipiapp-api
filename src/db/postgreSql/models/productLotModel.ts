import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL } from '../../../constants';
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

  declare createdBy?: string;
  declare updatedBy?: string;
  declare deletedBy?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { ProductLotModel, StoreModel } = models;

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
    tableName: POSTGRE_SQL_MODEL.PRODUCT_LOTS.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.PRODUCT_LOTS.MODEL_NAME,
  }
);
