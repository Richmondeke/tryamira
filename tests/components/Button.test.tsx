import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('src/components/ui/Button.tsx', () => {
  it('renders button with children text', () => {
    render(<Button>Deploy Digital Worker</Button>);
    expect(screen.getByText('Deploy Digital Worker')).toBeInTheDocument();
  });

  it('triggers onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
