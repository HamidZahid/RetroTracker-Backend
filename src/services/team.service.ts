import { Team } from '../models/Team.model';
import { TeamMembership } from '../models/TeamMembership.model';
import { User } from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { TeamRole } from '../types';

export const teamService = {
  async createTeam(name: string, userId: string, description?: string) {
    const team = await Team.create({ name, description, createdBy: userId });

    await TeamMembership.create({
      team: team._id,
      user: userId,
      role: TeamRole.OWNER,
    });

    return team;
  },

  async getUserTeams(userId: string) {
    const memberships = await TeamMembership.find({ user: userId })
      .populate('team')
      .sort({ joinedAt: -1 });

    return memberships.map((m) => m.team);
  },

  async getTeamById(teamId: string, userId: string) {
    const membership = await TeamMembership.findOne({
      team: teamId,
      user: userId,
    });

    if (!membership) {
      throw new AppError('Access denied', 403);
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Populate members
    const members = await this.getTeamMembers(teamId);
    const teamObj = team.toObject();
    (teamObj as any).members = members;

    return teamObj;
  },

  async inviteMember(
    teamId: string,
    email: string,
    role: TeamRole | string = TeamRole.MEMBER
  ) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const existing = await TeamMembership.findOne({
      team: teamId,
      user: user._id,
    });

    if (existing) {
      throw new AppError('User already a member', 400);
    }

    // Map 'admin' to 'owner' if needed
    const backendRole = role === 'admin' ? TeamRole.OWNER : (role as TeamRole);

    const membership = await TeamMembership.create({
      team: teamId,
      user: user._id,
      role: backendRole,
    });

    const populated = await membership.populate('user', 'name email avatarInitials');
    const memObj: any = populated.toObject();
    if (memObj.user && typeof memObj.user === 'object') {
      return {
        userId: String((memObj.user as any)._id),
        name: (memObj.user as any).name,
        email: (memObj.user as any).email,
        role: memObj.role === TeamRole.OWNER ? 'admin' : 'member',
        joinedAt: memObj.joinedAt,
      };
    }
    return memObj;
  },

  async getTeamMembers(teamId: string) {
    const memberships = await TeamMembership.find({ team: teamId })
      .populate('user', 'name email avatarInitials')
      .sort({ joinedAt: -1 });

    return memberships.map((membership) => {
      const memObj = membership.toObject();
      if (memObj.user && typeof memObj.user === 'object') {
        return {
          userId: String((memObj.user as any)._id),
          name: (memObj.user as any).name,
          email: (memObj.user as any).email,
          role: memObj.role === TeamRole.OWNER ? 'admin' : 'member',
          joinedAt: memObj.joinedAt,
        };
      }
      return memObj;
    });
  },

  async removeMember(teamId: string, memberId: string) {
    await TeamMembership.findByIdAndDelete(memberId);
  },

  async updateTeam(teamId: string, updates: { name?: string; description?: string }) {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    return team;
  },
};

