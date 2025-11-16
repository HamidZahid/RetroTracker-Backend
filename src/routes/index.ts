import { Router } from 'express';
import authRoutes from './auth.routes';
import teamRoutes from './team.routes';
import retroRoutes from './retro.routes';
import cardRoutes from './card.routes';
import actionItemRoutes from './actionItem.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use(retroRoutes);
router.use(cardRoutes);
router.use(actionItemRoutes);

export default router;

