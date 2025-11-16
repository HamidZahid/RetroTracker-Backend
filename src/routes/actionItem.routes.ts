import { Router } from 'express';
import { actionItemController } from '../controllers/actionItem.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireTeamMember } from '../middleware/authorization.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/teams/:teamId/action-items',
  requireTeamMember,
  actionItemController.createActionItem
);
router.get(
  '/teams/:teamId/action-items',
  requireTeamMember,
  actionItemController.getTeamActionItems
);
router.put('/action-items/:actionItemId', actionItemController.updateActionItem);
router.delete(
  '/action-items/:actionItemId',
  actionItemController.deleteActionItem
);

export default router;

