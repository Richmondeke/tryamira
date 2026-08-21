import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('src/lib/logger.ts', () => {
  beforeEach(() => {
    logger.setLevel('debug');
    logger.clearBreadcrumbs();
    vi.restoreAllMocks();
  });

  it('records and returns breadcrumbs up to limit', () => {
    logger.addBreadcrumb('Initialized session');
    logger.addBreadcrumb('Loaded workspace');
    const crumbs = logger.getBreadcrumbs();
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toContain('Initialized session');
    expect(crumbs[1]).toContain('Loaded workspace');
  });

  it('respects log level filtering', () => {
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    logger.setLevel('warn');
    logger.debug('Debug message should not print');
    logger.info('Info message should not print');

    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('formats errors and metadata correctly on warn and error logs', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logger.setLevel('error');
    const testErr = new Error('Test DB connection failure');
    logger.error('Failed to sync database', { userId: 'usr_123' }, testErr);

    expect(consoleErrorSpy).toHaveBeenCalled();
    const firstArg = consoleErrorSpy.mock.calls[0][0];
    const secondArg = consoleErrorSpy.mock.calls[0][1] as any;

    expect(firstArg).toContain('[ERROR]');
    expect(firstArg).toContain('Failed to sync database');
    expect(secondArg.userId).toBe('usr_123');
    expect(secondArg.error.message).toBe('Test DB connection failure');
  });
});
