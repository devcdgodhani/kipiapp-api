import { Schema, model } from 'mongoose';
import { IProductSpecificationDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import {
  MONGOOSE_MODEL,
  PRODUCT_SPECIFICATION_QUANTITY_TYPE,
  PRODUCT_SPECIFICATION_VALUE_TYPE,
  STORE_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
} from '../../../constants';
import { StoreModel, UserModel } from '../../postgreSql';

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
    type: String,
    required: false,
    validate: {
      validator: async function (value: string) {
        if (!value) return true;
        const exists = await UserModel.count({ where: { id: value } });
        return !!exists;
      },
      message: USER_ERROR_MESSAGES.VENDOR_NOT_FOUND,
    },
  },
  storeId: {
    type: String,
    required: false,
    validate: {
      validator: async function (value: string) {
        if (!value) return true;
        const exists = await StoreModel.count({ where: { id: value } });
        return !!exists;
      },
      message: STORE_ERROR_MESSAGES.NOT_FOUND,
    },
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
