const winston = require('winston');

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${__basedir}/logs/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${__basedir}/logs/combined.log` })
  ]
});

const logger = {
  error: winstonLogger.error,
  warn: winstonLogger.warning,
  info: winstonLogger.info,
  verbose: winstonLogger.verbose,
  debug: winstonLogger.debug,
  log: winstonLogger.log
};

module.exports = logger;