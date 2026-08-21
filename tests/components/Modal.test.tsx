import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/ui/Modal';

describe('src/components/ui/Modal.tsx', () => {
  it('renders modal dialog when isOpen is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Create AI Agent">
        <p>Modal Content Body</p>
      </Modal>
    );

    expect(screen.getByText('Create AI Agent')).toBeInTheDocument();
    expect(screen.getByText('Modal Content Body')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose} title="Hidden Modal">
        <p>Hidden Body</p>
      </Modal>
    );

    expect(screen.queryByText('Hidden Modal')).toBeNull();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('×'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
