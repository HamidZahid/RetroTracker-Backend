import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { retroService } from '../services/retro.service';
import { sendSuccess } from '../utils/response.utils';

export const retroController = {
  async createRetro(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, sprintNumber, startDate, endDate } = req.body;
      const retro = await retroService.createRetro({
        teamId: req.params.teamId,
        name,
        sprintNumber,
        startDate,
        endDate,
        userId: req.userId!,
      });
      sendSuccess(res, retro, 201);
    } catch (error) {
      next(error);
    }
  },

  async getTeamRetros(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, startDate, endDate, page, limit } = req.query;
      const result = await retroService.getTeamRetros(req.params.teamId, {
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getRetroById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const retro = await retroService.getRetroById(req.params.retroId);
      sendSuccess(res, retro);
    } catch (error) {
      next(error);
    }
  },

  async deleteRetro(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await retroService.deleteRetro(req.params.retroId);
      sendSuccess(res, null, 200, 'Retrospective deleted');
    } catch (error) {
      next(error);
    }
  },
};

