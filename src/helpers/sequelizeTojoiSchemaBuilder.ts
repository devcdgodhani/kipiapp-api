/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { Model, DataTypes, ModelAttributeColumnOptions, ModelStatic } from 'sequelize';

// ---- Convert Sequelize Field to Joi Field ---- //

const convertSequelizeField = (attr: ModelAttributeColumnOptions, isFilter = false): Joi.Schema => {
  const type: any = attr.type;

  let rule: Joi.Schema;

  switch (true) {
    case type instanceof DataTypes.STRING:
    case type instanceof DataTypes.TEXT:
      rule = Joi.string();
      if (attr.validate && attr.validate.isIn) {
        const isIn = attr.validate.isIn;
        if (Array.isArray(isIn) && Array.isArray(isIn[0])) {
          rule = rule.valid(...(isIn[0] as string[]));
        }
      }
      break;

    case type instanceof DataTypes.UUID:
      rule = Joi.string().uuid();
      break;

    case type instanceof DataTypes.INTEGER ||
      type instanceof DataTypes.FLOAT ||
      type instanceof DataTypes.DECIMAL:
      rule = Joi.number();
      break;

    case type instanceof DataTypes.BOOLEAN:
      rule = Joi.boolean();
      break;

    case type instanceof DataTypes.DATE || type instanceof DataTypes.DATEONLY:
      rule = Joi.date();
      break;

    case type instanceof DataTypes.ENUM:
      rule = Joi.string().valid(...(type as any).options.values);
      break;

    case type instanceof DataTypes.ARRAY:
      rule = Joi.array().items(convertSequelizeField({ type: (type as any).type }, isFilter));
      break;

    case type instanceof DataTypes.JSON || type instanceof DataTypes.JSONB:
      rule = Joi.object();
      break;

    default:
      rule = Joi.any();
  }

  // required / allow null
  if (attr.allowNull === false) {
    rule = rule.required();
  }

  // filter mode: allow array and range
  if (isFilter) {
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

  return rule;
};

// ---- Main Builder ---- //
export const sequelizeToJoi = <T extends Record<string, any>>(options: {
  schema: ModelStatic<Model>;
  includeFields?: (keyof T)[];
  excludeFields?: (keyof T)[];
  requiredFields?: (keyof T)[];
  isFilterSchema?: boolean;
}) => {
  const { schema, includeFields, excludeFields, requiredFields, isFilterSchema } = options;

  const joiObj: Record<string, Joi.Schema> = {
    search: Joi.string(),
    id: Joi.string().uuid(),
  };

  Object.entries(schema.rawAttributes).forEach(([key, attr]) => {
    // Exclusion logic
    if (excludeFields?.includes(key as keyof T)) return;
    if (includeFields && !includeFields.includes(key as keyof T)) return;

    let rule = convertSequelizeField(attr as any, !!isFilterSchema);

    if (requiredFields?.includes(key as keyof T)) {
      rule = rule.required();
    }

    joiObj[key] = rule;
  });

  return joiObj;
};
// ---- Validate like your mongoose validateSchema ---- //

// export const validateSchema = (schemaObj: Record<string, Joi.Schema>, data: any) => {
//   const { error, value } = Joi.object(schemaObj).validate(data, {
//     abortEarly: false,
//     allowUnknown: false,
//   });

//   if (error) {
//     throw new ApiError(
//       HTTP_STATUS_CODE.BAD_REQUEST.CODE,
//       HTTP_STATUS_CODE.BAD_REQUEST.STATUS,
//       error.details.map((x) => x.message).join(', ')
//     );
//   }
//   return value;
// };
