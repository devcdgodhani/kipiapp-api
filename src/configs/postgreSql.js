/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
if (process.env.NODE_ENV && process.env.NODE_ENV === 'test') {
  dotenv.config({ path: process.cwd() + '/.env.test' });
} else {
  dotenv.config();
}

const postgresConfig = {
  host: process.env.PG_DB_HOST,
  port: Number(process.env.PG_DB_PORT),
  username: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
  dbLogging: (message) => {
    if (!['test', 'production', 'development', 'local'].includes(process.env.NODE_ENV)) {
      console.log(message);
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <--- allow self-signed
    },
  },
};

if (['production'].includes(process.env.NODE_ENV)) {
  postgresConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}
module.exports = postgresConfig;
