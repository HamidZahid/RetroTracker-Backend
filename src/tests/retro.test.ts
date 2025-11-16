import request from 'supertest';
import { app } from '../app';
import { Team } from '../models/Team.model';
import { TeamMembership } from '../models/TeamMembership.model';
import { TeamRole } from '../types';

describe('Retro API', () => {
  let token: string;
  let userId: string;
  let teamId: string;

  beforeEach(async () => {
    // Register user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;

    // Create team
    const team = await Team.create({
      name: 'Test Team',
      createdBy: userId,
    });

    teamId = String(team._id);

    await TeamMembership.create({
      team: teamId,
      user: userId,
      role: TeamRole.OWNER,
    });
  });

  describe('POST /api/teams/:teamId/retros', () => {
    it('should create a retro', async () => {
      const res = await request(app)
        .post(`/api/teams/${teamId}/retros`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Sprint 1 Retro',
          sprintNumber: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Sprint 1 Retro');
    });

    it('should not create retro for non-member', async () => {
      const otherUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Other User',
          email: 'other@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post(`/api/teams/${teamId}/retros`)
        .set('Authorization', `Bearer ${otherUserRes.body.data.token}`)
        .send({
          name: 'Sprint 1 Retro',
        });

      expect(res.status).toBe(403);
    });
  });
});

