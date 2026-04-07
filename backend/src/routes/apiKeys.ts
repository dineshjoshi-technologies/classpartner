import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TIER_LIMITS } from '../lib/config';
import prisma from '../lib/prisma';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, key, provider, usageLimit } = req.body;

    if (!name || !key || !provider) {
      return res.status(400).json({
        success: false,
        error: 'Name, key, and provider are required',
        statusCode: 400,
      });
    }

    const validProviders = ['openai', 'anthropic'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        error: `Invalid provider. Must be one of: ${validProviders.join(', ')}`,
        statusCode: 400,
      });
    }

    const tier = req.user!.tier;
    const limits = TIER_LIMITS[tier];

    const currentKeyCount = await prisma.apiKey.count({
      where: { userId: req.user!.id, isActive: true },
    });

    if (currentKeyCount >= (limits?.maxApiKeys || 0)) {
      return res.status(403).json({
        success: false,
        error: `Maximum API keys (${limits?.maxApiKeys || 0}) reached for ${tier} tier`,
        statusCode: 403,
      });
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        provider,
        userId: req.user!.id,
        usageLimit: usageLimit || limits?.dailyApiCalls || 1000,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        provider: apiKey.provider,
        isActive: apiKey.isActive,
        usageLimit: apiKey.usageLimit,
        usedCount: apiKey.usedCount,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        usageLimit: true,
        usedCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: apiKeys });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        usageLimit: true,
        usedCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
        statusCode: 404,
      });
    }

    res.json({ success: true, data: apiKey });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, isActive, usageLimit } = req.body;

    const apiKeyId = String(req.params.id);

    const existingKey = await prisma.apiKey.findFirst({
      where: { id: apiKeyId, userId: req.user!.id },
    });

    if (!existingKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
        statusCode: 404,
      });
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        ...(name !== undefined && { name }),
        ...(isActive !== undefined && { isActive }),
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

    res.json({ success: true, data: updatedKey });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apiKeyId = String(req.params.id);

    const existingKey = await prisma.apiKey.findFirst({
      where: { id: apiKeyId, userId: req.user!.id },
    });

    if (!existingKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
        statusCode: 404,
      });
    }

    await prisma.apiKey.delete({ where: { id: apiKeyId } });

    res.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
