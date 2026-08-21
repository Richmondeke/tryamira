import { describe, it, expect } from 'vitest';
import { inviteTeamMember, getTeamMembers } from '@/app/actions/team';

describe('src/app/actions/team.ts', () => {
  it('invites a new team member successfully', async () => {
    const res = await inviteTeamMember('colleague@example.com', 'Admin', 1);
    expect(res.success).toBe(true);
    expect(res.message).toContain('colleague@example.com');
  });

  it('retrieves workspace team members list', async () => {
    const members = await getTeamMembers(1);
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);
    expect(members[0].email).toBeTruthy();
  });
});
