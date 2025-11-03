import { Schema, Types, model } from 'mongoose';
import { IProductLotDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';

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
      ref: 'stores',
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductLotModel = model<IProductLotDocument>('product_lots', ProductLotSchema);
