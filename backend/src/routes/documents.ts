import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, status, page, limit } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { userId: req.user!.id };
    if (type) where.type = type as string;
    if (status) where.status = status as string;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          format: true,
          projectId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.document.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const document = await prisma.document.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/project/:projectId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId as string;

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: req.user!.id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        format: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
