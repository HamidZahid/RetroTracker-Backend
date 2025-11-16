import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { cardService } from '../services/card.service';
import { sendSuccess } from '../utils/response.utils';

export const cardController = {
  async createCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, content } = req.body;
      const card = await cardService.createCard({
        retroId: req.params.retroId,
        type,
        content,
        userId: req.userId!,
      });
      sendSuccess(res, card, 201);
    } catch (error) {
      next(error);
    }
  },

  async getRetroCards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const cards = await cardService.getRetroCards(
        req.params.retroId,
        includeDeleted
      );
      sendSuccess(res, cards);
    } catch (error) {
      next(error);
    }
  },

  async updateCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { content, votes } = req.body;
      const card = await cardService.updateCard(req.params.cardId, { content, votes });
      sendSuccess(res, card);
    } catch (error) {
      next(error);
    }
  },

  async deleteCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cardService.deleteCard(req.params.cardId);
      sendSuccess(res, null, 200, 'Card deleted');
    } catch (error) {
      next(error);
    }
  },
};

