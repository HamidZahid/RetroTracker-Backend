import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Connect to database for Vercel serverless functions
// Mongoose caches connections, so this will reuse existing connections
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      console.log('✅ MongoDB Connected');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
    }
  }
};

// Connect to DB before handling any requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

// Export app as default for Vercel serverless functions
export default app;
