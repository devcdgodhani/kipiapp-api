import { Schema, Types, model } from 'mongoose';
import { IProductDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { ProductSpecificationSchemaObject } from './productSpecificationModel';
import {
  CATEGORY_ERROR_MESSAGES,
  MONGOOSE_MODEL,
  PRODUCT_COMMON_STATUS,
  PRODUCT_LOT_ERROR_MESSAGES,
  STORE_ERROR_MESSAGES,
  SUB_CATEGORY_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
  USER_TYPE,
} from '../../../constants';
import { SubCategoryModel } from './subCategoryModel';
import { CategoryModel } from './categoryModel';
import { StoreModel } from './storeModel';
import { UserModel } from './userModel';
import { ProductLotModel } from './productLotModel';

export const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    enTitle: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    enDescription: {
      type: String,
      required: false,
      trim: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.CATEGORIES,
      required: true,
      validate: {
        validator: async function (value: Types.ObjectId) {
          if (!value) return true;
          const exists = await CategoryModel.exists({ id: value });
          return !!exists;
        },
        message: CATEGORY_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.SUB_CATEGORIES,
      required: true,
      validate: {
        validator: async function (value: Types.ObjectId) {
          if (!value) return true;
          const exists = await SubCategoryModel.exists({ id: value });
          return !!exists;
        },
        message: SUB_CATEGORY_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    storeId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.STORES,
      required: true,
      validate: {
        validator: async function (value: Types.ObjectId) {
          if (!value) return true;
          const exists = await StoreModel.exists({ id: value });
          return !!exists;
        },
        message: STORE_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    vendorId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.USERS,
      required: false,
      validate: {
        validator: async function (value: Types.ObjectId) {
          if (!value) return true;
          const exists = await UserModel.exists({ id: value, type: USER_TYPE.VENDOR });
          return !!exists;
        },
        message: USER_ERROR_MESSAGES.VENDOR_NOT_FOUND,
      },
    },
    lotId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.PRODUCT_LOTS,
      required: false,
      validate: {
        validator: async function (value: Types.ObjectId) {
          if (!value) return true;
          const exists = await ProductLotModel.exists({ id: value });
          return !!exists;
        },
        message: PRODUCT_LOT_ERROR_MESSAGES.NOT_FOUND,
      },
    },
    totalUnit: {
      type: Number,
      required: true,
      default: 0,
    },
    soldUnit: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    specifications: {
      type: [ProductSpecificationSchemaObject],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_COMMON_STATUS),
      required: true,
      default: PRODUCT_COMMON_STATUS.ACTIVE,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductModel = model<IProductDocument>(MONGOOSE_MODEL.PRODUCTS, ProductSchema);
