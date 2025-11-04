import { Schema, Types, model } from 'mongoose';
import { IProductSpecificationDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import {
  PRODUCT_SPECIFICATION_QUANTITY_TYPE,
  PRODUCT_SPECIFICATION_VALUE_TYPE,
} from '../../../constants';

export const ProductSpecificationSchema = new Schema<IProductSpecificationDocument>(
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
    valueType: {
      type: String,
      enum: Object.values(PRODUCT_SPECIFICATION_VALUE_TYPE),
      required: true,
    },
    value: {
      type: String,
      required: false,
      trim: true,
    },
    multipleValue: {
      type: [String],
      required: false,
      default: [],
    },
    enValue: {
      type: String,
      required: false,
      trim: true,
    },
    quantityType: {
      type: String,
      enum: Object.values(PRODUCT_SPECIFICATION_QUANTITY_TYPE),
      required: true,
    },
    uuid: {
      type: String,
      required: false,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'users',
      required: false,
    },
    storeId: {
      type: Types.ObjectId,
      ref: 'stores',
      required: false,
    },

    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductSpecificationModel = model<IProductSpecificationDocument>(
  'product_specifications',
  ProductSpecificationSchema
);
