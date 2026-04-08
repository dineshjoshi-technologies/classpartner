import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { documents: true } } },
    });

    res.json({
      success: true,
      data: {
        projects: projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.type,
          status: p.status,
          userId: p.userId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          _count: p._count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
      include: { _count: { select: { documents: true } } },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        type: project.type,
        status: project.status,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        _count: project._count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, type } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'title is required',
        statusCode: 400,
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description ?? null,
        type: type ?? null,
        status: 'active',
        userId: req.user!.id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        type: project.type,
        status: project.status,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { title, description, status } = req.body;

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        type: updated.type,
        status: updated.status,
        userId: updated.userId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({ where: { id: project.id } });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
