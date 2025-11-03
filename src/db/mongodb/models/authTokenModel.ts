import { Schema, model } from 'mongoose';
import { IAuthTokenDocument } from '../../../interfaces';
import { TOKEN_TYPE } from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

// Schema
const AuthTokenSchema = new Schema<IAuthTokenDocument>(
  {
    token: { type: String, required: false },
    type: { type: String, enum: Object.values(TOKEN_TYPE), required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: false },
    expiredAt: { type: Number, required: false },
    referenceTokenId: { type: Schema.Types.ObjectId, ref: 'aut_tokens', required: false },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Model
export const AuthTokenModel = model<IAuthTokenDocument>('aut_tokens', AuthTokenSchema);
