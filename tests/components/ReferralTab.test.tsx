import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReferralTab } from '@/components/account/ReferralTab';

describe('src/components/account/ReferralTab.tsx', () => {
  it('renders referral link and metrics', () => {
    const handleCopy = vi.fn();
    render(
      <ReferralTab
        refLink="https://heyamira.com/ref/richmond123"
        refClicks={45}
        refSignups={12}
        refEarned={360}
        onCopyLink={handleCopy}
      />
    );

    expect(screen.getByDisplayValue('https://heyamira.com/ref/richmond123')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('$360')).toBeInTheDocument();
  });

  it('triggers onCopyLink callback when button is clicked', () => {
    const handleCopy = vi.fn();
    render(
      <ReferralTab
        refLink="https://heyamira.com/ref/richmond123"
        refClicks={10}
        refSignups={2}
        refEarned={60}
        onCopyLink={handleCopy}
      />
    );

    fireEvent.click(screen.getByText('Copy Link'));
    expect(handleCopy).toHaveBeenCalledTimes(1);
  });
});
