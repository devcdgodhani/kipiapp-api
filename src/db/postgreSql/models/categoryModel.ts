import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, COMMON_STATUS } from '../../../constants';
import { ICategoryAttributes } from '../../../interfaces';
import { TCategoryCreate } from '../../../types';

export class CategoryModel
  extends Model<ICategoryAttributes, TCategoryCreate>
  implements ICategoryAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare enTitle: string;
  declare status: COMMON_STATUS;
  declare storeId: string;

  declare createdBy?: string;
  declare updatedBy?: string;
  declare deletedBy?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { CategoryModel, StoreModel } = models;

    CategoryModel.belongsTo(StoreModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.CATEGORIES.ASSOCIATIONS.STORE,
    });

    StoreModel.hasMany(CategoryModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.STORES.ASSOCIATIONS.CATEGORY_LIST,
    });
  }
}

CategoryModel.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(COMMON_STATUS)],
      },
      defaultValue: COMMON_STATUS.ACTIVE,
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
    tableName: POSTGRE_SQL_MODEL.CATEGORIES.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.CATEGORIES.MODEL_NAME,
  }
);
