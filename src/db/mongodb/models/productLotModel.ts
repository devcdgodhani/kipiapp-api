import { Schema, Types, model } from 'mongoose';
import { IProductLotDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { MONGOOSE_MODEL } from '../../../constants';

export const ProductLotSchema = new Schema<IProductLotDocument>(
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
    sequence: {
      type: Number,
      required: true,
      unique: true,
    },
    storeId: {
      type: Types.ObjectId,
      ref: MONGOOSE_MODEL.STORES,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductLotModel = model<IProductLotDocument>(
  MONGOOSE_MODEL.PRODUCT_LOTS,
  ProductLotSchema
);
