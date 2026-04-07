import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { callAI } from '../services/aiProxy';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { provider, model, body, apiKeyId } = req.body;

    if (!provider || !model || !body || !apiKeyId) {
      return res.status(400).json({
        success: false,
        error: 'Provider, model, body, and apiKeyId are required',
        statusCode: 400,
      });
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: { id: apiKeyId, userId: req.user!.id, isActive: true },
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found or inactive',
        statusCode: 404,
      });
    }

    if (apiKey.usedCount >= apiKey.usageLimit) {
      return res.status(429).json({
        success: false,
        error: 'API key usage limit reached',
        statusCode: 429,
        usedCount: apiKey.usedCount,
        usageLimit: apiKey.usageLimit,
      });
    }

    const result = await callAI({
      provider: provider as 'openai' | 'anthropic',
      model,
      body,
      apiKey: apiKey.key,
    });

    await Promise.all([
      prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { usedCount: { increment: 1 } },
      }),
      prisma.usageLog.create({
        data: {
          userId: req.user!.id,
          provider,
          model,
          tokens: result.usage.totalTokens,
          cost: 0,
        },
      }),
    ]);

    res.json({
      success: true,
      data: result.data,
      usage: result.usage,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(502).json({
        success: false,
        error: `AI provider error: ${error.message}`,
        statusCode: 502,
      });
    }
    next(error);
  }
});

export default router;
