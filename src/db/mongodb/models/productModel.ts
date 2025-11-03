import { Schema, Types, model } from 'mongoose';
import { IProductDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';

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
    storeId: {
      type: Types.ObjectId,
      ref: 'users',
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductModel = model<IProductDocument>('product', ProductSchema);
