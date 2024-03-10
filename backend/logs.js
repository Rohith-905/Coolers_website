const fs = require('fs');
const log4js = require('log4js');

// Create a new folder with timestamp
const logsFolderName = `logs_${new Date().toISOString().replace(/:/g, '-')}`;
fs.mkdirSync(logsFolderName);

// Update log4js configuration to write logs to the new folder
log4js.configure({
  appenders: {
    file: { type: 'file', filename: `${logsFolderName}/frontend.log` },
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'debug' }
  }
});

// Get logger instance
const logger = log4js.getLogger();

// Log frontend messages
logger.debug('This is a debug message from the frontend');
logger.info('This is an info message from the frontend');
logger.warn('This is a warning message from the frontend');
logger.error('This is an error message from the frontend');

// Backend logging (for Node.js backend)
// Configure log4js for backend similar to frontend and write logs to the same folder
