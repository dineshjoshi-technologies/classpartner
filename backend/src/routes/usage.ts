import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { TIER_LIMITS } from '../lib/config';

const router = Router();

router.get('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tier = req.user!.tier;
    const limits = TIER_LIMITS[tier];

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      todayUsage,
      monthUsage,
      documentCount,
      apiKeyCount,
    ] = await Promise.all([
      prisma.usageLog.count({
        where: {
          userId,
          createdAt: { gte: startOfDay },
        },
      }),
      prisma.usageLog.aggregate({
        where: {
          userId,
          createdAt: { gte: startOfMonth },
        },
        _sum: { tokens: true, cost: true },
        _count: true,
      }),
      prisma.document.count({
        where: {
          userId,
          type: { not: null },
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.apiKey.count({
        where: {
          userId,
          isActive: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        tier,
        limits: {
          dailyApiCalls: limits.dailyApiCalls,
          maxApiKeys: limits.maxApiKeys,
          monthlyTokenLimit: limits.monthlyTokenLimit,
          monthlyDocuments: limits.monthlyDocuments,
        },
        usage: {
          todayApiCalls: todayUsage,
          dailyRemaining: Math.max(0, limits.dailyApiCalls - todayUsage),
          monthTokens: monthUsage._sum.tokens || 0,
          monthTokenLimit: limits.monthlyTokenLimit,
          monthTokenRemaining: Math.max(0, limits.monthlyTokenLimit - (monthUsage._sum.tokens || 0)),
          monthDocuments: documentCount,
          monthDocumentsRemaining: Math.max(0, limits.monthlyDocuments - documentCount),
          activeApiKeys: apiKeyCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
