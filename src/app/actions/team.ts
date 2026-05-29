'use server';

export async function inviteTeamMember(email: string, role: string, workspaceId: number = 1) {
  console.log(`Inviting ${email} to workspace ${workspaceId} with role ${role}`);
  
  // In a real app, you would:
  // 1. Check if user exists in auth.users
  // 2. Insert into team_members table
  // 3. Send email invite via Resend
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { success: true, message: `Successfully sent invitation to ${email}` };
}

export async function getTeamMembers(workspaceId: number = 1) {
  // Mock data until Supabase schema is deployed
  return [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', role: 'Admin', initials: 'JD' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'Agent', initials: 'JS' },
  ];
}
