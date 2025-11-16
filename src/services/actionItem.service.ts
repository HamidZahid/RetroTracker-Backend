import { ActionItem } from '../models/ActionItem.model';
import { ActionItemStatus } from '../types';
import { AppError } from '../middleware/error.middleware';

export const actionItemService = {
  async createActionItem(data: {
    teamId: string;
    retroId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    userId: string;
  }) {
    const actionItem = await ActionItem.create({
      team: data.teamId,
      retro: data.retroId,
      title: data.title,
      description: data.description,
      assignedTo: data.assignedTo,
      createdBy: data.userId,
    });

    return actionItem
      .populate('createdBy', 'name email avatarInitials')
      .then((item) => item.populate('assignedTo', 'name email avatarInitials'))
      .then((item) => item.populate('retro', 'name'));
  },

  async getTeamActionItems(
    teamId: string,
    filters?: {
      status?: ActionItemStatus;
      retroId?: string;
      search?: string;
    }
  ) {
    const query: any = { team: teamId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.retroId) {
      query.retro = filters.retroId;
    }

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    return ActionItem.find(query)
      .populate('createdBy', 'name email avatarInitials')
      .populate('assignedTo', 'name email avatarInitials')
      .populate('retro', 'name')
      .sort({ createdAt: -1 });
  },

  async updateActionItem(
    actionItemId: string,
    updates: {
      title?: string;
      description?: string;
      status?: ActionItemStatus;
      assignedTo?: string;
    }
  ) {
    const actionItem = await ActionItem.findByIdAndUpdate(
      actionItemId,
      updates,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email avatarInitials')
      .populate('assignedTo', 'name email avatarInitials')
      .populate('retro', 'name');

    if (!actionItem) {
      throw new AppError('Action item not found', 404);
    }

    return actionItem;
  },

  async deleteActionItem(actionItemId: string) {
    await ActionItem.findByIdAndDelete(actionItemId);
  },
};

