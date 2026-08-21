import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from '@/components/ui/Toast';

describe('src/components/ui/Toast.tsx', () => {
  it('renders success toast message correctly', () => {
    const handleClose = vi.fn();
    render(<Toast message="Workspace updated successfully!" type="success" onClose={handleClose} />);
    expect(screen.getByText('Workspace updated successfully!')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders error toast message correctly', () => {
    const handleClose = vi.fn();
    render(<Toast message="Connection failed!" type="error" onClose={handleClose} />);
    expect(screen.getByText('Connection failed!')).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument();
  });
});
