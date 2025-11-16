import mongoose, { Schema } from 'mongoose';
import { ITeam } from '../types';

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

teamSchema.index({ createdBy: 1 });

export const Team = mongoose.model<ITeam>('Team', teamSchema);

