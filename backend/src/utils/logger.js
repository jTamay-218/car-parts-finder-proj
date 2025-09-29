import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || 'INFO';
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  log(level, message, meta = {}) {
    const levelValue = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    const currentLevelValue = LOG_LEVELS[this.level] || LOG_LEVELS.INFO;

    if (levelValue <= currentLevelValue) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      // Console output
      if (level === 'ERROR') {
        console.error(formattedMessage);
      } else if (level === 'WARN') {
        console.warn(formattedMessage);
      } else {
        console.log(formattedMessage);
      }

      // File output
      this.writeToFile(formattedMessage);
    }
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Request logging
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      this.warn('HTTP Request', meta);
    } else {
      this.info('HTTP Request', meta);
    }
  }

  // Error logging with stack trace
  logError(error, req = null) {
    const meta = {
      message: error.message,
      stack: error.stack,
      name: error.name
    };

    if (req) {
      meta.request = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
      };
    }

    this.error('Application Error', meta);
  }

  // Database query logging
  logQuery(query, params, duration) {
    this.debug('Database Query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      params: params,
      duration: `${duration}ms`
    });
  }

  // Authentication logging
  logAuth(action, userId, success, meta = {}) {
    const level = success ? 'info' : 'warn';
    this[level]('Authentication', {
      action,
      userId,
      success,
      ...meta
    });
  }

  // Business logic logging
  logBusiness(action, userId, meta = {}) {
    this.info('Business Logic', {
      action,
      userId,
      ...meta
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience methods
export const { error, warn, info, debug, logRequest, logError, logQuery, logAuth, logBusiness } = logger;
