import mongoose, { Schema } from 'mongoose';
import { ITeamMembership, TeamRole } from '../types';

const teamMembershipSchema = new Schema<ITeamMembership>(
  {
    team: {
      type: String,
      ref: 'Team',
      required: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(TeamRole),
      required: true,
      default: TeamRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Compound index for uniqueness and queries
teamMembershipSchema.index({ team: 1, user: 1 }, { unique: true });
teamMembershipSchema.index({ user: 1 });

export const TeamMembership = mongoose.model<ITeamMembership>(
  'TeamMembership',
  teamMembershipSchema
);

