import { Router } from 'express';
import { teamController } from '../controllers/team.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  requireTeamMember,
  requireTeamOwner,
} from '../middleware/authorization.middleware';

const router = Router();

router.use(authenticate);

router.post('/', teamController.createTeam);
router.get('/', teamController.getUserTeams);
router.get('/:teamId', requireTeamMember, teamController.getTeamById);
router.put('/:teamId', requireTeamOwner, teamController.updateTeam);
router.post('/:teamId/invite', requireTeamOwner, teamController.inviteMember);
router.get(
  '/:teamId/members',
  requireTeamMember,
  teamController.getTeamMembers
);
router.delete(
  '/:teamId/members/:memberId',
  requireTeamOwner,
  teamController.removeMember
);

export default router;

