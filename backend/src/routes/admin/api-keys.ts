import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';
import prisma from '../../lib/prisma';
import { refreshKeyCache } from '../../services/openrouter';

const router = Router();

const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { role: true },
  });

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
      statusCode: 403,
    });
  }

  next();
};

router.post('/', requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, key } = req.body;

    if (!name || !key) {
      return res.status(400).json({
        success: false,
        error: 'name and key are required',
        statusCode: 400,
      });
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        provider: 'openrouter',
        userId: req.user!.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        usageLimit: true,
        usedCount: true,
        createdAt: true,
      },
    });

    await refreshKeyCache();

    res.status(201).json({
      success: true,
      data: apiKey,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keys = await prisma.apiKey.findMany({
      where: { provider: 'openrouter' },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        usageLimit: true,
        usedCount: true,
        lastErrorAt: true,
        errorCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const keyStats = await Promise.all(
      keys.map(async (k) => {
        const [todayCount, totalUsage] = await Promise.all([
          prisma.usageLog.count({
            where: {
              provider: 'openrouter',
              createdAt: {
                gte: new Date(new Date().toDateString()),
              },
            },
          }),
          prisma.usageLog.aggregate({
            where: { provider: 'openrouter' },
            _sum: { tokens: true, cost: true },
            _count: true,
          }),
        ]);

        return {
          ...k,
          todayUsage: todayCount,
          totalUsage: {
            totalTokens: totalUsage._sum.tokens || 0,
            totalCost: totalUsage._sum.cost || 0,
            totalCalls: totalUsage._count,
          },
        };
      })
    );

    res.json({
      success: true,
      data: keyStats,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        provider: 'openrouter',
      },
    });

    if (!apiKey) {
      throw new AppError('OpenRouter API key not found', 404);
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    await refreshKeyCache();

    res.json({
      success: true,
      data: { message: 'API key deleted' },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive, name, usageLimit } = req.body;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        provider: 'openrouter',
      },
    });

    if (!apiKey) {
      throw new AppError('OpenRouter API key not found', 404);
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(name !== undefined && { name }),
        ...(usageLimit !== undefined && { usageLimit }),
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        usageLimit: true,
        usedCount: true,
        updatedAt: true,
      },
    });

    await refreshKeyCache();

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
