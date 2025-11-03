import Joi from 'joi';
import * as dotenv from 'dotenv';
import { IEnvVariables } from '../interfaces';

dotenv.config();
// if (process.env.NODE_ENV === 'test') {
//   dotenv.config({ path: path });
// } else {
//   dotenv.config();
// }

const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('local', 'development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),

  PG_DB_PORT: Joi.number().default(5432),
  PG_DB_HOST: Joi.string().required(),
  PG_DB_USER: Joi.string().required(),
  PG_DB_PASSWORD: Joi.string().required(),
  PG_DB_NAME: Joi.string().required(),

  MONGO_DB_CONNECTION_URL: Joi.string().required(),
  MONGO_DB_NAME: Joi.string(),

  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),

  LOG_FOLDER: Joi.string().required(),
  LOG_FILE: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  META_CLIENT_ID: Joi.string().required(),
  META_CLIENT_SECRET: Joi.string().required(),

  APPLE_CLIENT_ID: Joi.string().required(),
  APPLE_TEAM_ID: Joi.string().required(),
  APPLE_KEY_ID: Joi.string().required(),
  APPLE_PRIVATE_KEY: Joi.string().required(),

  SERVER_URL: Joi.string().required(),
  WEB_SERVER_URL: Joi.string().required(),

  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),

  SMTP_SERVER: Joi.string().required(),
  SMTP_EMAIL: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),

  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  SEND_GRID_API_KEY: Joi.string().required(),
}).unknown();

const { value, error } = envValidation.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const ENV_VARIABLE: IEnvVariables = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,

  PG_DB_HOST: value.PG_DB_HOST,
  PG_DB_PORT: value.PG_DB_PORT,
  PG_DB_USER: value.PG_DB_USER,
  PG_DB_PASSWORD: value.PG_DB_PASSWORD,
  PG_DB_NAME: value.PG_DB_NAME,

  MONGO_DB_CONNECTION_URL: value.MONGO_DB_CONNECTION_URL,
  MONGO_DB_NAME: value.MONGO_DB_NAME,

  JWT_SECRET: value.JWT_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES: value.JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS: value.JWT_REFRESH_EXPIRATION_DAYS,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: value.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: value.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,

  LOG_FOLDER: value.LOG_FOLDER,
  LOG_FILE: value.LOG_FILE,
  LOG_LEVEL: value.LOG_LEVEL,

  GOOGLE_CLIENT_ID: value.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: value.GOOGLE_CLIENT_SECRET,

  META_CLIENT_ID: value.META_CLIENT_ID,
  META_CLIENT_SECRET: value.META_CLIENT_SECRET,

  APPLE_CLIENT_ID: value.APPLE_CLIENT_ID,
  APPLE_TEAM_ID: value.APPLE_TEAM_ID,
  APPLE_KEY_ID: value.APPLE_KEY_ID,
  APPLE_PRIVATE_KEY: value.APPLE_PRIVATE_KEY,

  SERVER_URL: value.SERVER_URL,
  WEB_SERVER_URL: value.WEB_SERVER_URL,

  AWS_BUCKET_NAME: value.AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: value.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: value.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: value.AWS_REGION,

  SMTP_SERVER: value.SMTP_SERVER,
  SMTP_EMAIL: value.SMTP_EMAIL,
  SMTP_PORT: value.SMTP_PORT,
  SMTP_USER: value.SMTP_USER,
  SMTP_PASS: value.SMTP_PASS,

  FIREBASE_PROJECT_ID: value.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: value.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: value.FIREBASE_PRIVATE_KEY,

  SEND_GRID_API_KEY: value.SEND_GRID_API_KEY,
};
