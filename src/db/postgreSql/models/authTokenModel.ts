import { Schema, model } from 'mongoose';
import { IAuthTokenDocument } from '../../../interfaces';
import { MONGOOSE_MODEL, TOKEN_TYPE } from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

// Schema
const AuthTokenSchema = new Schema<IAuthTokenDocument>(
  {
    token: { type: String, required: false },
    type: { type: String, enum: Object.values(TOKEN_TYPE), required: false },
    userId: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODEL.USERS, required: false },
    expiredAt: { type: Number, required: false },
    referenceTokenId: {
      type: Schema.Types.ObjectId,
      ref: MONGOOSE_MODEL.AUTH_TOKENS,
      required: false,
    },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Model
export const AuthTokenModel = model<IAuthTokenDocument>(
  MONGOOSE_MODEL.AUTH_TOKENS,
  AuthTokenSchema
);
