import { Schema, Types, model } from 'mongoose';
import { IStoreDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';

export const StoreSchema = new Schema<IStoreDocument>(
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
    userId: {
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

export const StoreModel = model<IStoreDocument>('store', StoreSchema);
