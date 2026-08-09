import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import soilRoutes from './routes/soil.routes.js';
import cropRoutes from './routes/crop.routes.js';
import fertilizerRoutes from './routes/fertilizer.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import marketRoutes from './routes/market.routes.js';
import mandiRoutes from './routes/mandi.routes.js';
import schemesRoutes from './routes/schemes.routes.js';
import aiRoutes from './routes/ai.routes.js';
import transparencyRoutes from './routes/transparency.routes.js';
import ttsRoutes from './routes/tts.routes.js';
import ocrRoutes from './routes/ocr.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://agrisaar-project.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? '*' : allowedOrigins, 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🌾 Smart Farming AI Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('/api/soil', soilRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/ocr', ocrRoutes);

// Proxy for Python ML Backend
app.use('/api/ml', createProxyMiddleware({ 
  target: process.env.ML_BACKEND_URL || 'http://127.0.0.1:8000', 
  changeOrigin: true 
}));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🌾 Smart Farming AI Server running on http://localhost:${PORT}`);
  logger.info(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
