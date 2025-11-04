import { Schema, model } from 'mongoose';
import { IAuthActionHistoryDocument } from '../../../interfaces';
import { AUTH_ACTION_TYPE, MONGOOSE_MODEL } from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

// Schema
const AuthActionHistorySchema = new Schema<IAuthActionHistoryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: MONGOOSE_MODEL.USERS, required: false },
    type: { type: String, enum: Object.values(AUTH_ACTION_TYPE), required: false },
    actionAt: { type: Number, required: false },
    deviceId: { type: String, required: false },
    deviceIp: { type: Boolean, required: false },
    ...defaultAttributes,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Model
export const AuthActionHistoryModel = model<IAuthActionHistoryDocument>(
  MONGOOSE_MODEL.AUTH_ACTION_HISTORIES,
  AuthActionHistorySchema
);
