import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { DOCUMENT_PROMPTS, TIER_LIMITS } from '../lib/config';
import { callOpenRouter } from '../services/openrouter';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, type, topic, instructions } = req.body;

    if (!type || !topic) {
      return res.status(400).json({
        success: false,
        error: 'type and topic are required',
        statusCode: 400,
      });
    }

    const validTypes = ['essay', 'presentation', 'research_paper'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
        statusCode: 400,
      });
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: req.user!.id },
      });
      if (!project) {
        throw new AppError('Project not found or access denied', 404);
      }
    }

    const tier = req.user!.tier;
    const limits = TIER_LIMITS[tier];

    if (limits.monthlyDocuments > 0) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthCount = await prisma.document.count({
        where: {
          userId: req.user!.id,
          type: { not: null },
          createdAt: { gte: startOfMonth },
        },
      });

      if (monthCount >= limits.monthlyDocuments) {
        return res.status(429).json({
          success: false,
          error: 'Monthly document generation limit reached',
          statusCode: 429,
          used: monthCount,
          limit: limits.monthlyDocuments,
        });
      }
    }

    const promptConfig = DOCUMENT_PROMPTS[type];
    const systemPrompt = promptConfig.system;

    const userMessage = instructions
      ? `Topic: ${topic}\n\nAdditional instructions: ${instructions}`
      : `Topic: ${topic}`;

    const document = await prisma.document.create({
      data: {
        title: topic.substring(0, 100),
        content: '',
        type,
        status: 'generating',
        projectId: projectId || null,
        userId: req.user!.id,
        format: type === 'presentation' ? 'html' : 'markdown',
      },
    });

    try {
      const { content, usage, modelUsed } = await callOpenRouter(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        undefined,
        promptConfig.maxTokens
      );

      await prisma.document.update({
        where: { id: document.id },
        data: {
          content,
          status: 'completed',
          title: content.split('\n')[0].replace(/^#+\s*/, '').substring(0, 100) || document.title,
        },
      });

      await prisma.usageLog.create({
        data: {
          userId: req.user!.id,
          provider: 'openrouter',
          model: modelUsed,
          tokens: usage.total_tokens,
          cost: 0,
        },
      });

      const updatedDoc = await prisma.document.findUnique({
        where: { id: document.id },
      });

      res.json({
        success: true,
        data: {
          documentId: updatedDoc?.id,
          content: updatedDoc?.content,
          status: updatedDoc?.status,
        },
      });
    } catch (aiError: unknown) {
      await prisma.document.update({
        where: { id: document.id },
        data: {
          status: 'failed',
          content: `Generation failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
        },
      });

      throw aiError;
    }
  } catch (error) {
    next(error);
  }
});

export default router;
