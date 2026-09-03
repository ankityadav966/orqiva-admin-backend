import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  const uri = ENV.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB connection failed: MONGODB_URI is missing in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log('MongoDB Atlas Connected');
    console.log(`[MongoDB] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
