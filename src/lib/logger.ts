export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name?: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel = 'info';
  private breadcrumbs: string[] = [];

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
      this.minLevel = envLevel;
    }
  }

  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public addBreadcrumb(crumb: string): void {
    this.breadcrumbs.push(`[${new Date().toISOString()}] ${crumb}`);
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }

  public getBreadcrumbs(): string[] {
    return [...this.breadcrumbs];
  }

  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  private shouldLog(level: LogLevel): boolean {
    const priority: Record<LogLevel, number> = {
      debug: 10,
      info: 20,
      warn: 30,
      error: 40,
    };
    return priority[level] >= priority[this.minLevel];
  }

  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>, err?: unknown): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    };

    if (err instanceof Error) {
      entry.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err && typeof err === 'object') {
      entry.error = {
        message: JSON.stringify(err),
      };
    } else if (typeof err === 'string') {
      entry.error = {
        message: err,
      };
    }

    return entry;
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    const entry = this.formatEntry('debug', message, context);
    console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, context || '');
  }

  public info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    const entry = this.formatEntry('info', message, context);
    console.info(`[INFO] ${entry.timestamp} - ${message}`, context || '');
  }

  public warn(message: string, context?: Record<string, unknown>, err?: unknown): void {
    if (!this.shouldLog('warn')) return;
    const entry = this.formatEntry('warn', message, context, err);
    console.warn(`[WARN] ${entry.timestamp} - ${message}`, { ...context, error: entry.error });
  }

  public error(message: string, context?: Record<string, unknown>, err?: unknown): void {
    if (!this.shouldLog('error')) return;
    const entry = this.formatEntry('error', message, context, err);
    console.error(`[ERROR] ${entry.timestamp} - ${message}`, { ...context, error: entry.error });
  }
}

export const logger = new Logger();
