import { Dialect } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const baseConfig = {
  dialect: 'postgres' as Dialect,
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'mydb',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

export = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
