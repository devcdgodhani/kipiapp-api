import { Schema, Types, model } from 'mongoose';
import { IProductDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { ProductSpecificationSchemaObject } from './productSpecificationModel';
import { MONGOOSE_MODEL, PRODUCT_COMMON_STATUS } from '../../../constants';

export const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
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
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.SUB_CATEGORIES,
      required: true,
    },
    storeId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.STORES,
      required: true,
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
