import { Schema, Types, model } from 'mongoose';
import { IProductDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { ProductSpecificationSchema } from './productSpecificationModel';
import { PRODUCT_COMMON_STATUS } from '../../../constants';

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
      ref: 'stores',
      required: true,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: 'stores',
      required: true,
    },
    storeId: {
      type: Types.ObjectId,
      ref: 'stores',
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
      type: [ProductSpecificationSchema],
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

export const ProductModel = model<IProductDocument>('product', ProductSchema);
