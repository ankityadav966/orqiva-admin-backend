import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/orqiva_admin',
  JWT_SECRET: process.env.JWT_SECRET || 'orqiva_secret_key_default_fallback_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000',
  ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  PUBLIC_WEBSITE_URL: process.env.PUBLIC_WEBSITE_URL || 'https://www.orqivatech.com',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@orqivatech.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@Orqiva2026!',
  ADMIN_NAME: process.env.ADMIN_NAME || 'ORQIVA Administrator',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
