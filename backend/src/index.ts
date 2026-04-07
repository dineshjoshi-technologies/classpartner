import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import apiKeysRoutes from './routes/apiKeys';
import aiProxyRoutes from './routes/aiProxy';
import generateRoutes from './routes/generate';
import streamRoutes from './routes/stream';
import documentsRoutes from './routes/documents';
import usageRoutes from './routes/usage';
import adminApiKeysRoutes from './routes/admin/api-keys';
import { authenticate } from './middleware/auth';
import { enforceTierLimits } from './middleware/tierAccess';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/projects', authenticate, projectRoutes);
app.use('/api/api-keys', authenticate, apiKeysRoutes);
app.use('/api/ai', enforceTierLimits, aiProxyRoutes);
app.use('/api/generate', authenticate, generateRoutes);
app.use('/api/stream', authenticate, streamRoutes);
app.use('/api/documents', authenticate, documentsRoutes);
app.use('/api/usage', authenticate, usageRoutes);
app.use('/api/admin/api-keys', authenticate, adminApiKeysRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;