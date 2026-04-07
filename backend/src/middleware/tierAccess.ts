import { Response, NextFunction } from 'express';
import { AuthRequest, authenticate } from './auth';
import { TIER_LIMITS } from '../lib/config';
import prisma from '../lib/prisma';

export const checkTierAccess = (requiredTier: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { tier: true },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          statusCode: 401,
        });
      }

      const tiers = ['free', 'pro', 'team', 'institution'];
      const userTierIndex = tiers.indexOf(user.tier);
      const requiredTierIndex = tiers.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        return res.status(403).json({
          success: false,
          error: `Access restricted to ${requiredTier} tier and above`,
          statusCode: 403,
          currentTier: user.tier,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkDailyApiCalls = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tier = req.user!.tier;
    const limits = TIER_LIMITS[tier];

    if (!limits || limits.dailyApiCalls === 0) {
      return res.status(403).json({
        success: false,
        error: 'API access not available for your tier',
        statusCode: 403,
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayUsage = await prisma.usageLog.count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    });

    if (todayUsage >= limits.dailyApiCalls) {
      return res.status(429).json({
        success: false,
        error: 'Daily API call limit reached',
        statusCode: 429,
        used: todayUsage,
        limit: limits.dailyApiCalls,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const enforceTierLimits = [authenticate, checkDailyApiCalls];
