import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    const connection = await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

