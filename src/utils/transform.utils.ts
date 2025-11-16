import { TeamRole } from '../types';

/**
 * Transform MongoDB document to include id alias and format for frontend
 */
export const transformDocument = (doc: any): any => {
  if (!doc) return doc;

  // Convert to plain object if it's a Mongoose document
  const obj = doc.toObject ? doc.toObject() : doc;

  // Add id alias for _id
  if (obj._id) {
    obj.id = String(obj._id);
  }

  // Transform role: owner -> admin for frontend compatibility
  if (obj.role === TeamRole.OWNER) {
    obj.role = 'admin';
  }

  // Transform author to authorName for cards
  if (obj.author && typeof obj.author === 'object') {
    obj.authorName = obj.author.name || '';
    obj.author = String(obj.author._id || obj.author);
  }

  // Transform createdBy to object format if needed
  if (obj.createdBy && typeof obj.createdBy === 'object') {
    obj.createdBy = {
      _id: String(obj.createdBy._id),
      name: obj.createdBy.name,
      email: obj.createdBy.email,
    };
  }

  // Transform teamId from team reference
  if (obj.team && !obj.teamId) {
    obj.teamId = String(obj.team);
  }

  // Transform retroId from retro reference
  if (obj.retro && !obj.retroId) {
    obj.retroId = String(obj.retro);
  }

  // Transform userId from user reference in team members
  if (obj.user && typeof obj.user === 'object') {
    obj.userId = String(obj.user._id);
    obj.name = obj.user.name;
    obj.email = obj.user.email;
    obj.avatarInitials = obj.user.avatarInitials;
  }

  return obj;
};

/**
 * Transform array of documents
 */
export const transformArray = (docs: any[]): any[] => {
  return docs.map(transformDocument);
};

/**
 * Transform team member response
 */
export const transformTeamMember = (membership: any): any => {
  const transformed = transformDocument(membership);
  if (transformed.user && typeof transformed.user === 'object') {
    return {
      userId: String(transformed.user._id),
      name: transformed.user.name,
      email: transformed.user.email,
      role: transformed.role === TeamRole.OWNER ? 'admin' : 'member',
      joinedAt: transformed.joinedAt,
    };
  }
  return transformed;
};

/**
 * Transform team response with members
 */
export const transformTeam = async (team: any, getMembers: () => Promise<any[]>): Promise<any> => {
  const transformed = transformDocument(team);
  const members = await getMembers();
  transformed.members = members.map(transformTeamMember);
  return transformed;
};

