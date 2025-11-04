import { Schema, Types, model } from 'mongoose';
import { IProductSpecificationDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import {
  MONGOOSE_MODEL,
  PRODUCT_SPECIFICATION_QUANTITY_TYPE,
  PRODUCT_SPECIFICATION_VALUE_TYPE,
} from '../../../constants';

export const ProductSpecificationSchemaObject = {
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
    ref: MONGOOSE_MODEL.USERS,
    required: false,
  },
  storeId: {
    type: Types.ObjectId,
    ref: MONGOOSE_MODEL.STORES,
    required: false,
  },
  ...defaultAttributes,
};

export const ProductSpecificationSchema = new Schema<IProductSpecificationDocument>(
  {
    ...ProductSpecificationSchemaObject,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductSpecificationModel = model<IProductSpecificationDocument>(
  MONGOOSE_MODEL.PRODUCT_SPECIFICATIONS,
  ProductSpecificationSchema
);
