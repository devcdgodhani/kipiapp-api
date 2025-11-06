import { Schema, Types, model } from 'mongoose';
import { IStoreDocument } from '../../../interfaces';
import { defaultAttributes } from '../plugins/baseSchema';
import { MONGOOSE_MODEL } from '../../../constants';

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
      ref: MONGOOSE_MODEL.USERS,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const StoreModel = model<IStoreDocument>(MONGOOSE_MODEL.STORES, StoreSchema);
