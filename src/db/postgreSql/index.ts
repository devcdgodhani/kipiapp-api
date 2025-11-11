/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import path from 'path';
import {
  Sequelize,
  Dialect,
  DestroyOptions,
  CreateOptions,
  BulkCreateOptions,
  UpdateOptions,
} from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
import { ENV_VARIABLE } from '../../configs';
import { POSTGRE_SQL_MODEL, POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS } from '../../constants';

dotenvConfig();

/* ------------------ ENV Configuration ------------------ */
const database = ENV_VARIABLE.PG_DB_NAME as string;
const username = ENV_VARIABLE.PG_DB_USER as string;
const password = ENV_VARIABLE.PG_DB_PASSWORD as string;
const host = ENV_VARIABLE.PG_DB_HOST || 'localhost';
const port = Number(ENV_VARIABLE.PG_DB_PORT) || 5432;
const dbLogging = ENV_VARIABLE.NODE_ENV !== 'production';
// const dialectOptions = {
//   ssl: ENV_VARIABLE.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : {},
// };
// const dialectOptions = {
//   ssl: {},
// };

/* ------------------ Sequelize Instance ------------------ */
export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  logging: dbLogging,
  dialect: 'postgres' as Dialect,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <--- allow self-signed
    },
  },
});

/* ------------------ Dynamic Model Loading ------------------ */

(async () => {
  const db: Record<string, any> = {};
  const modelsDir = path.join(__dirname, 'models');
  const files = (await fs.readdir(modelsDir)).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of files) {
    const modelPath = path.join(modelsDir, file);
    const modelModule = await import(modelPath);
    const modelDefiner = modelModule.default ?? modelModule;

    if (!modelDefiner?.name) continue;
    db[modelDefiner.name] = modelDefiner;
  }

  // Attach Sequelize instance
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // Run associate & hooks
  Object.keys(db.sequelize.models).forEach((modelName) => {
    /***************************************************************/
    /* Default associations belong to user model for all models */
    /***************************************************************/

    db.sequelize.models[modelName].belongsTo(
      db.sequelize.models[POSTGRE_SQL_MODEL.USERS.MODEL_NAME],
      {
        foreignKey: { name: 'createdBy', allowNull: true },
        as: POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS.CREATED_BY,
      }
    );

    db.sequelize.models[modelName].belongsTo(
      db.sequelize.models[POSTGRE_SQL_MODEL.USERS.MODEL_NAME],
      {
        foreignKey: { name: 'updatedBy', allowNull: true },
        as: POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS.UPDATED_BY,
      }
    );

    db.sequelize.models[modelName].belongsTo(
      db.sequelize.models[POSTGRE_SQL_MODEL.USERS.MODEL_NAME],
      {
        foreignKey: { name: 'deletedBy', allowNull: true },
        as: POSTGRE_SQL_MODEL_DEFAULT_ASSOCIATIONS.DELETED_BY,
      }
    );
    /*****************************************************/

    /***************************************************************/
    /* Other associations */
    /***************************************************************/

    if (typeof db.sequelize.models[modelName].associate === 'function') {
      db.sequelize.models[modelName].associate(db.sequelize.models);
    }

    /***************************************************************/
    /* Associate Hooks */
    /***************************************************************/

    if (typeof db[modelName]?.addHooks === 'function') {
      db.sequelize.models[modelName].addHooks(db.sequelize.models);
    }
  });
})();

/* ------------------ Global Hooks ------------------ */

// Before soft-delete: record deletedBy
sequelize.addHook('beforeBulkDestroy', async (options: DestroyOptions) => {
  const { userId } = options;
  if (userId) {
    const modelName = (options as any).model?.name;
    if (!modelName) return;
    const model = sequelize.models[modelName];
    const instances = await model.findAll({ where: options.where, raw: false });

    for (const instance of instances) {
      if ('deletedBy' in instance || 'deleted_by' in instance) {
        (instance as any).deletedBy = userId;
        await instance.save({ hooks: false });
      }
    }
  }
});

// Before create: record createdBy
sequelize.addHook('beforeCreate', async (instance: any, options: CreateOptions) => {
  if (options.userId && ('createdBy' in instance || 'created_by' in instance)) {
    instance.createdBy = options.userId;
  }
});

// Before bulk create: record createdBy for all
sequelize.addHook('beforeBulkCreate', async (instances: any[], options: BulkCreateOptions) => {
  const { userId } = options;
  if (userId) {
    for (const instance of instances) {
      if ('createdBy' in instance || 'created_by' in instance) {
        instance.createdBy = userId;
      }
    }
  }
});

// Before update: record updatedBy
sequelize.addHook('beforeBulkUpdate', async (options: UpdateOptions) => {
  if (options.userId && options.attributes) {
    options.attributes.updatedBy = options.userId;
  }
});

// Fix includes: make sure nested queries return models
sequelize.addHook('beforeFind', (options) => {
  if (options.include) {
    options.raw = false;
  } else {
    options.raw = true;
  }
});

export * from './models/userModel';
export * from './models/authActionHistoryModel';
export * from './models/authTokenModel';
export * from './models/otpModel';
export * from './models/categoryModel';
export * from './models/subCategoryModel';
export * from './models/productLotModel';
export * from './models/storeModel';
