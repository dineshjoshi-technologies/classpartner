import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { streamOpenRouter } from '../services/openrouter';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { DOCUMENT_PROMPTS, TIER_LIMITS } from '../lib/config';

const router = Router();

router.post('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { instructions } = req.body;

    const document = await prisma.document.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (!document.type) {
      throw new AppError('Document has no type for streaming generation', 400);
    }

    const promptConfig = DOCUMENT_PROMPTS[document.type];
    if (!promptConfig) {
      throw new AppError('Unsupported document type', 400);
    }

    const userMessage = instructions
      ? `Topic: ${document.title}\n\nAdditional instructions: ${instructions}`
      : `Topic: ${document.title}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullContent = '';

    await streamOpenRouter(
      [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: userMessage },
      ],
      {
        onChunk: (chunk: string) => {
          fullContent += chunk;
          res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
        },
        onDone: (_content: string, usage) => {
          res.write(`data: ${JSON.stringify({ type: 'done', usage, content: fullContent })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();

          prisma.document.update({
            where: { id: document.id },
            data: {
              content: fullContent,
              status: 'completed',
            },
          }).catch(console.error);

          prisma.usageLog.create({
            data: {
              userId: req.user!.id,
              provider: 'openrouter',
              model: 'streaming',
              tokens: usage.total_tokens,
              cost: 0,
            },
          }).catch(console.error);
        },
        onError: (error: Error) => {
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
          res.end();

          prisma.document.update({
            where: { id: document.id },
            data: {
              status: 'failed',
              content: `Streaming failed: ${error.message}`,
            },
          }).catch(console.error);
        },
      }
    );
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    }
  }
});

export default router;
