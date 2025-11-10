import { DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../index';
import { POSTGRE_SQL_MODEL, COMMON_STATUS } from '../../../constants';
import { ISubCategoryAttributes } from '../../../interfaces';
import { TSubCategoryCreate } from '../../../types';

export class SubCategoryModel
  extends Model<ISubCategoryAttributes, TSubCategoryCreate>
  implements ISubCategoryAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare enTitle: string;
  declare categoryId: string;
  declare status: COMMON_STATUS;
  declare storeId: string;

  declare createdBy?: string;
  declare updatedBy?: string;
  declare deletedBy?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;

  static associate(models: Record<string, ModelStatic<Model>>) {
    const { SubCategoryModel, CategoryModel, StoreModel } = models;

    // SubCategory belongs to Category
    SubCategoryModel.belongsTo(CategoryModel, {
      foreignKey: { name: 'categoryId', allowNull: false },
      as: POSTGRE_SQL_MODEL.SUB_CATEGORIES.ASSOCIATIONS.CATEGORY,
    });

    // Category has many SubCategories
    CategoryModel.hasMany(SubCategoryModel, {
      foreignKey: { name: 'categoryId', allowNull: false },
      as: POSTGRE_SQL_MODEL.CATEGORIES.ASSOCIATIONS.SUB_CATEGORY_LIST,
    });

    // SubCategory belongs to Store
    SubCategoryModel.belongsTo(StoreModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.SUB_CATEGORIES.ASSOCIATIONS.STORE,
    });

    // Store has many SubCategories
    StoreModel.hasMany(SubCategoryModel, {
      foreignKey: { name: 'storeId', allowNull: true },
      as: POSTGRE_SQL_MODEL.STORES.ASSOCIATIONS.SUB_CATEGORY_LIST,
    });
  }
}

SubCategoryModel.init(
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    tableName: POSTGRE_SQL_MODEL.SUB_CATEGORIES.TABLE_NAME,
    modelName: POSTGRE_SQL_MODEL.SUB_CATEGORIES.MODEL_NAME,
  }
);
