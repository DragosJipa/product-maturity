const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.align(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}\n`) // Add newline for console output
      ),
    }),
    // Comment out or remove the File transport for Vercel deployment
    /*
    new transports.File({
      filename: 'logs/server.log',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    */
  ],
});

// For production or environments where file logging is supported, uncomment the File transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.File({
    filename: 'logs/server.log',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  }));
}

module.exports = logger;
