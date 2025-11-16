import { User } from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { generateToken } from '../utils/jwt.utils';

export const authService = {
  async register(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const avatarInitials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user = await User.create({
      name,
      email,
      password,
      avatarInitials,
    });

    const token = generateToken(String(user._id));

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatarInitials: user.avatarInitials,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(String(user._id));

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatarInitials: user.avatarInitials,
      },
    };
  },

  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      avatarInitials: user.avatarInitials,
    };
  },

  async updateProfile(
    userId: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
    }
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if email is being updated and if it's already taken
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }
      user.email = updates.email;
    }

    // Update name
    if (updates.name) {
      user.name = updates.name;
      // Recalculate avatar initials if name changes
      user.avatarInitials = updates.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    // Update password if provided
    if (updates.password) {
      user.password = updates.password; // Will be hashed by pre-save hook
    }

    await user.save();

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      avatarInitials: user.avatarInitials,
    };
  },
};

