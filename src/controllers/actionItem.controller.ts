import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { actionItemService } from '../services/actionItem.service';
import { sendSuccess } from '../utils/response.utils';

export const actionItemController = {
  async createActionItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { retroId, title, description, assignedTo } = req.body;
      const actionItem = await actionItemService.createActionItem({
        teamId: req.params.teamId,
        retroId,
        title,
        description,
        assignedTo,
        userId: req.userId!,
      });
      sendSuccess(res, actionItem, 201);
    } catch (error) {
      next(error);
    }
  },

  async getTeamActionItems(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { status, retroId, search } = req.query;
      const actionItems = await actionItemService.getTeamActionItems(
        req.params.teamId,
        {
          status: status as any,
          retroId: retroId as string,
          search: search as string,
        }
      );
      sendSuccess(res, actionItems);
    } catch (error) {
      next(error);
    }
  },

  async updateActionItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, status, assignedTo } = req.body;
      const actionItem = await actionItemService.updateActionItem(
        req.params.actionItemId,
        { title, description, status, assignedTo }
      );
      sendSuccess(res, actionItem);
    } catch (error) {
      next(error);
    }
  },

  async deleteActionItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await actionItemService.deleteActionItem(req.params.actionItemId);
      sendSuccess(res, null, 200, 'Action item deleted');
    } catch (error) {
      next(error);
    }
  },
};

