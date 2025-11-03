import { Types } from 'mongoose';

/**
 * Common base schema fields (timestamps + audit info)
 */
export const defaultAttributes = {
  createdAt: { type: Date, },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  createdBy: { type: Types.ObjectId, ref: 'users', required: false },
  updatedBy: { type: Types.ObjectId, ref: 'users', required: false },
  deletedBy: { type: Types.ObjectId, ref: 'users', required: false },
};
