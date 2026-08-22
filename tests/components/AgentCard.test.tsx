import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from '@/components/agent-builder/AgentCard';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('src/components/agent-builder/AgentCard.tsx', () => {
  it('renders agent name and system prompt snippet', () => {
    render(
      <AgentCard 
        agent={{
          id: 'agent-123',
          name: 'Customer Service Lead',
          config: {
            systemPrompt: 'Handles inbound customer questions 24/7.',
            attachedWorkflows: ['wf-1', 'wf-2'],
          }
        }}
      />
    );

    expect(screen.getByText('Customer Service Lead')).toBeInTheDocument();
    expect(screen.getByText('2 Workflows Connected')).toBeInTheDocument();
    expect(screen.getByText('Handles inbound customer questions 24/7.')).toBeInTheDocument();
  });

  it('navigates to agent details page when clicked', () => {
    render(
      <AgentCard 
        agent={{
          id: 'agent-abc',
          name: 'Sales Qualifier',
        }}
      />
    );

    fireEvent.click(screen.getByText('Sales Qualifier'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/ai-agent/agent-abc');
  });
});
