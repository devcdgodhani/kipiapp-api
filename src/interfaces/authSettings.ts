import { ObjectId } from 'mongoose';
import {
  AUTH_SETTINGS_ALLOW_LOGIN_FOR,
  AUTH_SETTINGS_ALLOW_SIGN_UP_FOR,
  AUTH_SETTINGS_TYPE,
} from '../constants';
import { IDefaultAttributes } from './common';

export interface IAuthSettingsAttributes extends IDefaultAttributes {
  id: ObjectId;
  emailVerification: boolean;
  mobileVerification: boolean;
  allowLoginFor: AUTH_SETTINGS_ALLOW_LOGIN_FOR[];
  allowSignFor: AUTH_SETTINGS_ALLOW_SIGN_UP_FOR[];
  type: AUTH_SETTINGS_TYPE;
}

export interface IAuthSettingsDocument extends Omit<IAuthSettingsAttributes, 'id'>, Document {}
