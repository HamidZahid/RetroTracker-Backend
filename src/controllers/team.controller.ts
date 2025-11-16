import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { teamService } from '../services/team.service';
import { sendSuccess } from '../utils/response.utils';

export const teamController = {
  async createTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const team = await teamService.createTeam(name, req.userId!, description);
      sendSuccess(res, team, 201);
    } catch (error) {
      next(error);
    }
  },

  async getUserTeams(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const teams = await teamService.getUserTeams(req.userId!);
      sendSuccess(res, teams);
    } catch (error) {
      next(error);
    }
  },

  async getTeamById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const team = await teamService.getTeamById(
        req.params.teamId,
        req.userId!
      );
      sendSuccess(res, team);
    } catch (error) {
      next(error);
    }
  },

  async inviteMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      const membership = await teamService.inviteMember(
        req.params.teamId,
        email,
        role
      );
      sendSuccess(res, membership, 201);
    } catch (error) {
      next(error);
    }
  },

  async getTeamMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const members = await teamService.getTeamMembers(req.params.teamId);
      sendSuccess(res, members);
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await teamService.removeMember(req.params.teamId, req.params.memberId);
      sendSuccess(res, null, 200, 'Member removed');
    } catch (error) {
      next(error);
    }
  },

  async updateTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const team = await teamService.updateTeam(req.params.teamId, {
        name,
        description,
      });
      sendSuccess(res, team, 200, 'Team updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

