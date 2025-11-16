import { Document } from 'mongoose';

export enum TeamRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

export enum CardType {
  WENT_WELL = 'went_well',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  KUDOS = 'kudos',
}

export enum ActionItemStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum RetroStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatarInitials: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITeam extends Document {
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMembership extends Document {
  team: string;
  user: string;
  role: TeamRole;
  joinedAt: Date;
}

export interface IRetro extends Document {
  team: string;
  name: string;
  sprintNumber?: number;
  startDate?: Date;
  endDate?: Date;
  status: RetroStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICard extends Document {
  retro: string;
  type: CardType;
  content: string;
  author: string;
  votes: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActionItem extends Document {
  team: string;
  retro: string;
  title: string;
  description?: string;
  status: ActionItemStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

