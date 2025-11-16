import { Router } from 'express';
import { retroController } from '../controllers/retro.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  requireTeamMember,
  requireRetroAccess,
} from '../middleware/authorization.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/teams/:teamId/retros',
  requireTeamMember,
  retroController.createRetro
);
router.get(
  '/teams/:teamId/retros',
  requireTeamMember,
  retroController.getTeamRetros
);
router.get('/retros/:retroId', requireRetroAccess, retroController.getRetroById);
router.delete(
  '/retros/:retroId',
  requireRetroAccess,
  retroController.deleteRetro
);

export default router;

