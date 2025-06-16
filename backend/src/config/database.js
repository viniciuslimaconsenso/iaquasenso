import 'dotenv/config';

export default {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'iaquasenso',
  define: {
    timestamps: true,
    underscored: true,
  },
}; 