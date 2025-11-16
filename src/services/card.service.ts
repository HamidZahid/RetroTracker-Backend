import { Card } from '../models/Card.model';
import { CardType } from '../types';
import { AppError } from '../middleware/error.middleware';

export const cardService = {
  async createCard(data: {
    retroId: string;
    type: CardType;
    content: string;
    userId: string;
  }) {
    const card = await Card.create({
      retro: data.retroId,
      type: data.type,
      content: data.content,
      author: data.userId,
    });

    const populatedCard = await card.populate('author', 'name email avatarInitials');
    const cardObj: any = populatedCard.toObject();
    if (cardObj.author && typeof cardObj.author === 'object') {
      cardObj.authorName = (cardObj.author as any).name || '';
      cardObj.author = String((cardObj.author as any)._id);
    }
    return cardObj;
  },

  async getRetroCards(retroId: string, includeDeleted: boolean = false) {
    const query: any = { retro: retroId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const cards = await Card.find(query)
      .populate('author', 'name email avatarInitials')
      .sort({ createdAt: -1 });

    // Transform to include authorName
    return cards.map((card) => {
      const cardObj: any = card.toObject();
      if (cardObj.author && typeof cardObj.author === 'object') {
        cardObj.authorName = (cardObj.author as any).name || '';
        cardObj.author = String((cardObj.author as any)._id);
      }
      return cardObj;
    });
  },

  async updateCard(cardId: string, updates: { content?: string; votes?: string[] }) {
    const updateData: any = {};
    if (updates.content !== undefined) {
      updateData.content = updates.content;
    }
    if (updates.votes !== undefined) {
      updateData.votes = updates.votes;
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatarInitials');

    if (!card) {
      throw new AppError('Card not found', 404);
    }

    // Transform to include authorName
    const cardObj: any = card.toObject();
    if (cardObj.author && typeof cardObj.author === 'object') {
      cardObj.authorName = (cardObj.author as any).name || '';
      cardObj.author = String((cardObj.author as any)._id);
    }

    return cardObj;
  },

  async deleteCard(cardId: string) {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!card) {
      throw new AppError('Card not found', 404);
    }

    return card;
  },
};

