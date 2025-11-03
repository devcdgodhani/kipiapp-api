import { Schema, model } from 'mongoose';
import { IAuthSettingsDocument } from '../../../interfaces';
import {
  AUTH_SETTINGS_ALLOW_LOGIN_FOR,
  AUTH_SETTINGS_ALLOW_SIGN_UP_FOR,
  AUTH_SETTINGS_TYPE,
} from '../../../constants';
import { defaultAttributes } from '../plugins/baseSchema';

// Schema
const AuthSettingsSchema = new Schema<IAuthSettingsDocument>(
  {
    emailVerification: { type: Boolean, required: false, default: false },
    mobileVerification: { type: Boolean, required: false, default: false },
    allowLoginFor: {
      type: [String],
      enum: Object.values(AUTH_SETTINGS_ALLOW_LOGIN_FOR),
      required: false,
    },
    allowSignFor: {
      type: [String],
      enum: Object.values(AUTH_SETTINGS_ALLOW_SIGN_UP_FOR),
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(AUTH_SETTINGS_TYPE),
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
export const AuthSettingsModel = model<IAuthSettingsDocument>('auth_settings', AuthSettingsSchema);
