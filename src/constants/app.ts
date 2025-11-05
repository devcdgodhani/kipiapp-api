import { ENV_VARIABLE } from '../configs';
import { TCarrier } from '../types';
import { TOKEN_TYPE } from './common';
import path from 'path';

export const AUTH_TOKEN_EXPIRATION_IN_MINUTES: Record<TOKEN_TYPE, number> = {
  [TOKEN_TYPE.ACCESS_TOKEN]: 60 * 24 * 365,
  [TOKEN_TYPE.REFRESH_TOKEN]: 60 * 24 * 365,
  [TOKEN_TYPE.OTP_TOKEN]: 5,
  [TOKEN_TYPE.FORGET_PASSWORD_TOKEN]: 5,
};

const TEMPLATES = path.join(process.cwd(), 'templates');
export const EJS_TEMPLATES = {
  EMAIL_OTP: path.join(TEMPLATES, 'ejs', 'email-otp.ejs'),
};

export const API_BASE_URL = path.join(ENV_VARIABLE.SERVER_URL, 'api/v1');

export const OPEN_API = {
  VERIFY_OTP: path.join(API_BASE_URL, 'auth', 'verifyOtp'),
};

export enum EMAIL_SUBJECT_MESSAGE {
  EMAIL_OTP = 'Verification OTP',
}

export const APP_DETAILS = {
  SUPPORT_EMAIL: 'support@myapp.com',
  APP_NAME: 'My app',
};

export const MASTER_OTP = '55555555';

export const CARRIER_DOMAIN: Record<TCarrier, string> = {
  airtel: 'airtelmail.com',
  jio: 'jio.com',
  vodafone: 'vodafone.in',
  bsnl: 'bsnl.in',
  idea: 'ideacellular.net',
};
