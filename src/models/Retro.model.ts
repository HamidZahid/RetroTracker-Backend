import mongoose, { Schema } from 'mongoose';
import { IRetro, RetroStatus } from '../types';

const retroSchema = new Schema<IRetro>(
  {
    team: {
      type: String,
      ref: 'Team',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Retrospective name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    sprintNumber: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(RetroStatus),
      default: RetroStatus.ACTIVE,
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

retroSchema.index({ team: 1, createdAt: -1 });
retroSchema.index({ name: 'text' });

export const Retro = mongoose.model<IRetro>('Retro', retroSchema);

