import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/me', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, role: true, tier: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found', statusCode: 404 });
  }

  res.json({ success: true, data: user });
});

router.put('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name },
      select: { id: true, email: true, name: true, role: true, tier: true, updatedAt: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
