/**
 * Common base schema fields (timestamps + audit info)
 */
export const defaultAttributes = {
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
  createdBy: { type: String, required: false },
  updatedBy: { type: String, required: false },
  deletedBy: { type: String, required: false },
};
