import { Retro } from '../models/Retro.model';
import { Card } from '../models/Card.model';
import { AppError } from '../middleware/error.middleware';
import { RetroStatus } from '../types';

export const retroService = {
  async createRetro(data: {
    teamId: string;
    name: string;
    sprintNumber?: number;
    startDate?: string;
    endDate?: string;
    userId: string;
  }) {
    const retro = await Retro.create({
      team: data.teamId,
      name: data.name,
      sprintNumber: data.sprintNumber,
      startDate: data.startDate,
      endDate: data.endDate,
      createdBy: data.userId,
    });

    return retro.populate('createdBy', 'name email avatarInitials');
  },

  async getTeamRetros(
    teamId: string,
    filters?: {
      search?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const query: any = { team: teamId };
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate)
        query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const [retros, total] = await Promise.all([
      Retro.find(query)
        .populate('createdBy', 'name email avatarInitials')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Retro.countDocuments(query),
    ]);

    // Add card counts
    const retrosWithCounts = await Promise.all(
      retros.map(async (retro) => {
        const cards = await Card.find({
          retro: retro._id,
          isDeleted: false,
        });

        const cardCount = {
          wentWell: cards.filter((c) => c.type === 'went_well').length,
          needsImprovement: cards.filter(
            (c) => c.type === 'needs_improvement'
          ).length,
          kudos: cards.filter((c) => c.type === 'kudos').length,
        };

        return { ...retro.toObject(), cardCount };
      })
    );

    return {
      items: retrosWithCounts,
      total,
      page,
      limit,
    };
  },

  async getRetroById(retroId: string) {
    const retro = await Retro.findById(retroId).populate(
      'createdBy',
      'name email avatarInitials'
    );

    if (!retro) {
      throw new AppError('Retrospective not found', 404);
    }

    return retro;
  },

  async deleteRetro(retroId: string) {
    await Retro.findByIdAndDelete(retroId);
    await Card.deleteMany({ retro: retroId });
  },
};

