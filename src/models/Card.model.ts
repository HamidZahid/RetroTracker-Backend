import mongoose, { Schema } from 'mongoose';
import { ICard, CardType } from '../types';

const cardSchema = new Schema<ICard>(
  {
    retro: {
      type: String,
      ref: 'Retro',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(CardType),
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Card content is required'],
      trim: true,
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    votes: {
      type: [String],
      default: [],
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

cardSchema.index({ retro: 1, isDeleted: 1 });

export const Card = mongoose.model<ICard>('Card', cardSchema);

