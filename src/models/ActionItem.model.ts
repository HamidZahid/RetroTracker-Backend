import mongoose, { Schema } from 'mongoose';
import { IActionItem, ActionItemStatus } from '../types';

const actionItemSchema = new Schema<IActionItem>(
  {
    team: {
      type: String,
      ref: 'Team',
      required: true,
    },
    retro: {
      type: String,
      ref: 'Retro',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ActionItemStatus),
      default: ActionItemStatus.OPEN,
    },
    assignedTo: {
      type: String,
      ref: 'User',
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

actionItemSchema.index({ team: 1, status: 1 });
actionItemSchema.index({ retro: 1 });
actionItemSchema.index({ title: 'text', description: 'text' });

export const ActionItem = mongoose.model<IActionItem>(
  'ActionItem',
  actionItemSchema
);

