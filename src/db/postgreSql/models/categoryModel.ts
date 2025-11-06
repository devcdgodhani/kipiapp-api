import { Schema, Types, model } from 'mongoose';
import { ICategoryDocument } from '../../../interfaces';
import { COMMON_STATUS, MONGOOSE_MODEL } from '../../../constants';
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
      ref: MONGOOSE_MODEL.STORES,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create model
export const CategoryModel = model<ICategoryDocument>(MONGOOSE_MODEL.CATEGORIES, CategorySchema);
