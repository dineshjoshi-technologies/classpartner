import { Router, Request, RequestHandler } from 'express';
import expressRateLimit from 'express-rate-limit';

export const authLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many attempts, please try again later',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
