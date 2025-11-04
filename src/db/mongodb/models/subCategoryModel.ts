import { Schema, Types, model } from 'mongoose';
import { ISubCategoryDocument } from '../../../interfaces';
import { COMMON_STATUS, MONGOOSE_MODEL } from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

export const SubCategorySchema = new Schema<ISubCategoryDocument>(
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: MONGOOSE_MODEL.CATEGORIES,
      required: true,
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
export const SubCategoryModel = model<ISubCategoryDocument>(
  MONGOOSE_MODEL.SUB_CATEGORIES,
  SubCategorySchema
);
