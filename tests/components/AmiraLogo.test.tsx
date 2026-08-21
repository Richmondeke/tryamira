import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AmiraLogo } from '@/components/ui/AmiraLogo';

describe('src/components/ui/AmiraLogo.tsx', () => {
  it('renders Amira branding logo element', () => {
    render(<AmiraLogo size={32} />);
    const logoImg = screen.getByRole('img');
    expect(logoImg).toBeInTheDocument();
  });
});
