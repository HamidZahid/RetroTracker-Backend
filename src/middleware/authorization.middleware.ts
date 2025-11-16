import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { TeamMembership } from '../models/TeamMembership.model';
import { Retro } from '../models/Retro.model';
import { Card } from '../models/Card.model';
import { AppError } from './error.middleware';
import { TeamRole } from '../types';

export const requireTeamMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.params.teamId;
    const membership = await TeamMembership.findOne({
      team: teamId,
      user: req.userId,
    });

    if (!membership) {
      throw new AppError('Access denied: Not a team member', 403);
    }

    // Attach to request object (works for both GET and POST)
    if (!req.body) req.body = {};
    req.body.teamMembership = membership;
    (req as AuthRequest).teamMembership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireTeamOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.params.teamId;
    const membership = await TeamMembership.findOne({
      team: teamId,
      user: req.userId,
      role: TeamRole.OWNER,
    });

    if (!membership) {
      throw new AppError('Access denied: Team owner only', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRetroAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const retroId = req.params.retroId || req.body.retro;
    const retro = await Retro.findById(retroId);

    if (!retro) {
      throw new AppError('Retrospective not found', 404);
    }

    const membership = await TeamMembership.findOne({
      team: retro.team,
      user: req.userId,
    });

    if (!membership) {
      throw new AppError('Access denied: Not a team member', 403);
    }

    // Attach to request object (works for both GET and POST)
    if (!req.body) req.body = {};
    req.body.retro = retro;
    (req as AuthRequest).retro = retro;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireCardOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new AppError('Card not found', 404);
    }

    if (card.author.toString() !== req.userId) {
      throw new AppError('Access denied: Not card owner', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

