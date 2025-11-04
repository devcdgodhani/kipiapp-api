import { Types } from 'mongoose';
import { MONGOOSE_MODEL } from '../../../constants';

/**
 * Common base schema fields (timestamps + audit info)
 */
export const defaultAttributes = {
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  createdBy: { type: Types.ObjectId, ref: MONGOOSE_MODEL.USERS, required: false },
  updatedBy: { type: Types.ObjectId, ref: MONGOOSE_MODEL.USERS, required: false },
  deletedBy: { type: Types.ObjectId, ref: MONGOOSE_MODEL.USERS, required: false },
};
