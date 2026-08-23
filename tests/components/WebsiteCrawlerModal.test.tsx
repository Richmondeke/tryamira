import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WebsiteCrawlerModal } from '@/components/agent-builder/WebsiteCrawlerModal';
import * as crawlerActions from '@/app/actions/crawler';

vi.mock('@/app/actions/crawler', () => ({
  crawlAndTrainFromWebsite: vi.fn(),
}));

describe('src/components/agent-builder/WebsiteCrawlerModal.tsx', () => {
  it('renders URL input and action buttons', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    render(
      <WebsiteCrawlerModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    expect(screen.getByText('Train AI Agent from Website URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://yourbusiness.com')).toBeInTheDocument();
    expect(screen.getByText('Start 1-Click Training 🚀')).toBeInTheDocument();
  });

  it('triggers crawling action and fires onSuccess on completion', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    vi.mocked(crawlerActions.crawlAndTrainFromWebsite).mockResolvedValueOnce({
      success: true,
      pagesCrawled: 3,
      pages: [{ url: 'https://testclinic.com', title: 'Home', length: 500 }],
      combinedTextLength: 1500,
      vapiKbId: 'kb-test',
    });

    render(
      <WebsiteCrawlerModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('https://yourbusiness.com'), {
      target: { value: 'https://testclinic.com' },
    });

    fireEvent.click(screen.getByText('Start 1-Click Training 🚀'));

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
