import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { generateTokens } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { authLimiter, strictLimiter } from '../middleware/rateLimiter';

const router = Router();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password.length >= 8;

const handleValidationError = (res: Response, field: string, message: string) => {
  return res.status(400).json({
    success: false,
    error: message,
    statusCode: 400,
    field,
  });
};

const userResponseSelect = { id: true, email: true, name: true, role: true, tier: true } as const;

const storeRefreshToken = async (userId: string, encryptedToken: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { userId, token: encryptedToken, expiresAt },
  });
};

router.post('/signup', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return handleValidationError(res, 'email,password', 'Email and password are required');
    }

    if (!validateEmail(email)) {
      return handleValidationError(res, 'email', 'Invalid email format');
    }

    if (!validatePassword(password)) {
      return handleValidationError(res, 'password', 'Password must be at least 8 characters');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return handleValidationError(res, 'email', 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: userResponseSelect,
    });

    const tokens = generateTokens(user.id);
    await storeRefreshToken(user.id, tokens.refreshToken);

    res.status(201).json({ success: true, data: { user, ...tokens } });
  } catch (error) {
    next(error);
  }
});

router.post('/login', strictLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleValidationError(res, 'email,password', 'Email and password are required');
    }

    if (!validateEmail(email)) {
      return handleValidationError(res, 'email', 'Invalid email format');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const tokens = generateTokens(user.id);
    await storeRefreshToken(user.id, tokens.refreshToken);

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return handleValidationError(res, 'refreshToken', 'Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken, userId: decoded.userId },
      select: { id: true, expiresAt: true, userId: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        statusCode: 401,
      });
    }

    const [user, newTokens] = [
      await prisma.user.findUnique({ where: { id: decoded.userId }, select: userResponseSelect }),
      generateTokens(decoded.userId),
    ];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        statusCode: 401,
      });
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await storeRefreshToken(user.id, newTokens.refreshToken);

    res.json({ success: true, data: { user, ...newTokens } });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        statusCode: 401,
      });
    }
    next(error);
  }
});

router.post('/logout', strictLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
        statusCode: 400,
      });
    }

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
