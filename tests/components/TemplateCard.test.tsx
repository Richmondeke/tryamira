import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateCard } from '@/components/agent-builder/TemplateCard';
import { templatesData } from '@/data/agentTemplates';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('src/components/agent-builder/TemplateCard.tsx', () => {
  it('renders template information, capabilities, and integrations', () => {
    const template = templatesData[0];
    render(<TemplateCard template={template} />);

    expect(screen.getByText(template.name)).toBeInTheDocument();
    expect(screen.getByText(template.category)).toBeInTheDocument();
    expect(screen.getByText('Hire & Deploy Worker →')).toBeInTheDocument();
  });

  it('navigates to template onboarding setup on CTA click', () => {
    const template = templatesData[0];
    render(<TemplateCard template={template} />);

    fireEvent.click(screen.getByText('Hire & Deploy Worker →'));
    expect(mockPush).toHaveBeenCalledWith(`/dashboard/ai-agent?template=${template.id}`);
  });
});
