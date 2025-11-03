import { Schema, Types, model } from 'mongoose';
import { ICategoryDocument } from '../../../interfaces';
import { COMMON_STATUS } from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

export const CategorySchema = new Schema<ICategoryDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    enTitle: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(COMMON_STATUS),
      default: COMMON_STATUS.ACTIVE,
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

// Create model
export const CategoryModel = model<ICategoryDocument>('categories', CategorySchema);
