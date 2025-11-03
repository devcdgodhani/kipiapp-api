/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from 'mongoose';
import Joi, { NumberSchema, StringSchema, Schema as JoiSchema, AlternativesSchema } from 'joi';
import { ApiError } from './apiError';
import { HTTP_STATUS_CODE } from '../constants';
import { isValidMongoDbId } from './utils';

/* ---------------------- Types ---------------------- */

type MongoosePrimitive =
  | typeof String
  | typeof Number
  | typeof Boolean
  | typeof Date
  | typeof mongoose.Schema.Types.ObjectId
  | typeof mongoose.Schema.Types.Mixed
  | typeof Map;

type MongooseField =
  | MongoosePrimitive
  | Schema
  | MongooseField[]
  | {
      type?: MongooseField;
      enum?: unknown[];
      required?: boolean;
      default?: unknown;
      min?: number;
      max?: number;
      match?: RegExp;
      [key: string]: unknown;
    };

/* ---------------------- Safer Dot-path utility ---------------------- */

/**
 * Constrain T so keyof behaves predictably.
 */
type PlainObject = Record<string, any>;

/**
 * Join key and nested path with dot only when nested part is not empty.
 */
type Join<K extends string, P extends string> = P extends '' ? K : `${K}.${P}`;

/**
 * Small decrement tuple for recursion depth control.
 * Supports depths 0..9. Extend if you truly need more depth (but be careful).
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * NestedPaths<T, D>
 * - Produces a union of dot-path strings for object T up to depth D.
 * - Arrays are inspected and recursion continues into their element type.
 * - When D is 0 we return `string` as a fallback to stop deep instantiation.
 *
 * Usage: NestedPaths<MyType, 4>
 * Notes:
 * - Keep D reasonably small (3..6) for typical schemas to keep TS happy.
 * - Use a plain TS interface/type for T (not mongoose.Schema) to get useful autocompletion.
 */
export type NestedPaths<T extends PlainObject, D extends number = 5> =
  // Base case: when depth reaches 0, return string to avoid further expansion.
  D extends 0
    ? string
    : // If T is an array, recurse into its element type with decremented depth.
      T extends ReadonlyArray<infer U extends PlainObject>
      ? NestedPaths<U, Prev[D & keyof Prev]>
      : // If T is an object, build keys and nested keys.
        T extends object
        ? {
            [K in keyof T & string]: T[K] extends ReadonlyArray<infer U extends PlainObject>
              ? K | Join<K, NestedPaths<U, Prev[D & keyof Prev]>>
              : T[K] extends object
                ? K | Join<K, NestedPaths<T[K], Prev[D & keyof Prev]>>
                : K;
          }[keyof T & string]
        : never;

/* ---------------------- Generic MongooseToJoiOptions ---------------------- */

export interface MongooseToJoiOptions<T extends PlainObject = PlainObject> {
  schema: Schema;
  includeFields?: NestedPaths<T>[]; // autocomplete for top + nested fields up to D
  excludeFields?: NestedPaths<T>[];
  requiredFields?: NestedPaths<T>[];
  isFilterSchema?: boolean | 'single' | 'multiple' | 'both';
}

/* ---------------------- Helpers ---------------------- */

// Set nested value by path array
const setNested = (obj: Record<string, unknown>, path: string[], value: unknown) => {
  const key = path[0];
  if (path.length === 1) {
    obj[key] = value;
    return;
  }
  obj[key] = (obj[key] as Record<string, unknown>) || {};
  setNested(obj[key] as Record<string, unknown>, path.slice(1), value);
};

// Check if a dot-path is included/excluded
const isPathIncluded = (path: string, includeFields?: string[], excludeFields?: string[]) => {
  const included =
    !includeFields || includeFields.some((f) => f === path || f.startsWith(path + '.'));
  const excluded =
    excludeFields && excludeFields.some((f) => f === path || f.startsWith(path + '.'));
  return included && !excluded;
};

/* ---------------------- Core Converter ---------------------- */

const convertField = (fieldDef: MongooseField, isFilterSchema: boolean): JoiSchema => {
  // Arrays
  if (Array.isArray(fieldDef)) {
    const arrayItem = fieldDef[0];
    return Joi.array().items(arrayItem ? convertField(arrayItem, isFilterSchema) : Joi.any());
  }

  // Nested Schema
  if (fieldDef instanceof mongoose.Schema) {
    // recursion into nested mongoose.Schema
    return mongooseToJoiInternal(fieldDef, { isFilterSchema }).joiObj as unknown as JoiSchema;
  }

  // { type: Schema }
  if (
    typeof fieldDef === 'object' &&
    fieldDef !== null &&
    'type' in fieldDef &&
    (fieldDef as Record<string, unknown>).type instanceof mongoose.Schema
  ) {
    return mongooseToJoiInternal((fieldDef as Record<string, any>).type, { isFilterSchema })
      .joiObj as unknown as JoiSchema;
  }

  // Plain nested object literal (e.g., { a: String, b: { ... } })
  if (typeof fieldDef === 'object' && fieldDef !== null && !('type' in fieldDef)) {
    const nested: Record<string, JoiSchema> = {};
    for (const [key, val] of Object.entries(fieldDef)) {
      nested[key] = convertField(val as MongooseField, isFilterSchema);
    }
    return Joi.object(nested);
  }

  // { type: { ... } } where type is a plain object
  if (
    typeof fieldDef === 'object' &&
    fieldDef !== null &&
    typeof (fieldDef as Record<string, unknown>).type === 'object'
  ) {
    return convertField((fieldDef as Record<string, MongooseField>).type, isFilterSchema);
  }

  // Primitives and options
  const options =
    typeof fieldDef === 'object' && fieldDef !== null && 'type' in fieldDef
      ? (fieldDef as Record<string, unknown>)
      : {};
  const type = (options.type ?? fieldDef) as MongooseField;

  let rule: JoiSchema;

  switch (type) {
    case String: {
      let stringRule: StringSchema = Joi.string();
      if (Array.isArray(options.enum)) stringRule = stringRule.valid(...(options.enum as string[]));
      if (options.match instanceof RegExp) stringRule = stringRule.pattern(options.match);
      rule = stringRule;
      break;
    }
    case Number: {
      let numberRule: NumberSchema = Joi.number();
      if (typeof options.min === 'number') numberRule = numberRule.min(options.min);
      if (typeof options.max === 'number') numberRule = numberRule.max(options.max);
      rule = numberRule;
      break;
    }
    case Boolean:
      rule = Joi.boolean();
      break;
    case Date:
      rule = Joi.date();
      break;
    case mongoose.Schema.Types.ObjectId:
      rule = Joi.string().hex().length(24);
      break;
    case mongoose.Schema.Types.Mixed:
      rule = Joi.any();
      break;
    case Map:
      rule = Joi.object().pattern(Joi.string(), Joi.any());
      break;
    default:
      rule = Joi.any();
  }

  if (options.default !== undefined) rule = (rule as any).default(options.default);

  if (isFilterSchema) {
    rule = Joi.alternatives().try(rule, Joi.array().items(rule)) as AlternativesSchema;
    if (type === Number || type === Date) {
      rule = Joi.alternatives().try(
        rule,
        Joi.array().items(rule),
        Joi.object({
          from: rule,
          to: rule,
          lt: rule,
          gt: rule,
        })
      );
    }
  }

  return rule;
};

/* ---------------------- Internal Builder ---------------------- */

// type InternalResult = {
//   joiObj: Record<string, JoiSchema>;
//   includedFields: string[];
//   requiredFields: string[];
// };

const mongooseToJoiInternal = <T extends PlainObject>(
  schema: Schema,
  {
    includeFields,
    excludeFields,
    requiredFields,
    isFilterSchema = false,
    parentPath = '',
  }: Omit<MongooseToJoiOptions<T>, 'schema'> & { parentPath?: string } = {}
) => {
  const joiObj: Record<string, JoiSchema> = {
    id: Joi.alternatives().try(isValidMongoDbId, Joi.array().items(isValidMongoDbId)),
    search: Joi.string().trim(),
  };
  const allFields = Object.keys((schema as any).obj || {});

  const included: string[] = [];
  const finalRequired: string[] = [];

  for (const key of allFields) {
    const fullPath = (parentPath ? `${parentPath}.${key}` : key) as any;

    if (
      !isPathIncluded(
        fullPath,
        includeFields as string[] | undefined,
        excludeFields as string[] | undefined
      )
    )
      continue;

    const field = (schema as any).obj[key] as MongooseField;
    const rule = convertField(field, Boolean(isFilterSchema));

    // Set in nested joiObj using helper
    setNested(
      joiObj,
      [key],
      requiredFields && requiredFields.includes(fullPath) ? (rule as any).required() : rule
    );

    included.push(fullPath);
    if (requiredFields && requiredFields.includes(fullPath)) finalRequired.push(fullPath);
  }

  // return {
  //   joiObj,
  //   includedFields: included,
  //   requiredFields: finalRequired,
  // };
  return joiObj;
};

/* ---------------------- Exported Function ---------------------- */

export const mongooseToJoi = <T extends PlainObject>(options: MongooseToJoiOptions<T>) =>
  mongooseToJoiInternal<T>(options.schema, options);

/* ---------------------- Example Types & Usage (commented) ---------------------- */

/*
import { ObjectId } from 'mongoose';
import { GENDER, SIGN_UP_TYPE, USER_STATUS, USER_TYPE } from '../constants';
import { IDefaultAttributes } from './common';

export interface IUserAttributes extends IDefaultAttributes {
  id: ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  mobile: string;
  countryCode?: string;
  email: string;
  type: USER_TYPE;
  gender: GENDER;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  signUpType?: SIGN_UP_TYPE;
  isVerified: boolean;
  status: USER_STATUS;
  profile: {
    bio: string;
    social: {
      platform: string;
      url: string;
      profile: {
        bio: string;
        social: {
          platform: string;
          url: string;
          profile: {
            bio: string;
            social: { platform: string; url: string }[];
          };
        }[];
      };
    }[];
  };
}

export interface IUserDocument extends Omit<IUserAttributes, 'id'>, Document {}

// Example usage (use a plain TS type for T so NestedPaths<T> can compute keys)
// const schema = mongoose.model('User', UserSchema).schema;
// const result = mongooseToJoi<IUserAttributes>({
//   schema,
//   includeFields: ['firstName', 'profile', 'profile.social', 'profile.social.profile.bio'],
//   requiredFields: ['firstName', 'profile.social.profile.bio'],
//   isFilterSchema: true,
// });
// const joiObject = result.joiObj;
// console.log(result.includedFields, result.requiredFields);
*/

export const validateSchema = (
  schema: {
    [x: string]: Joi.Schema;
  },
  data: Record<string, any>,
  options = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    // stripUnknown: true, // remove unknown props
  }
) => {
  if (data.isPaginate) {
    schema = {
      ...schema,
      page: Joi.number().min(1).default(1),
      isPaginate: Joi.boolean(),
      limit: Joi.number().min(1).default(10),
      order: Joi.object().pattern(
        Joi.string().trim(), // field name
        Joi.number().valid(1, -1) // sorting direction
      ),
    };
  }
  const validSchema = Joi.object(schema);

  const { error, value: validData } = validSchema.validate(data, options);

  if (error) {
    const errorMessage = error.details
      .map((detail) => {
        if (detail.context?.message) {
          return `${detail.message}${detail.context.message}`;
        }
        return detail.message;
      })
      .join(', ');
    throw new ApiError(
      HTTP_STATUS_CODE.BAD_REQUEST.CODE,
      HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
      errorMessage
    );
  }
  return validData;
};
