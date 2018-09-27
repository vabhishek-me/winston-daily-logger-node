const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
var stringify = require('json-stringify-safe');

const customFormat = winston.format.printf(log => {
  return `${log.timestamp} [${log.level}]: ${log.message} ${log.meta ? '=> ' + stringify(log.meta, null, 2) : ''}`;
});

var winstonOptions = {
  file: {
    level: 'info',
    filename: 'app-logs-%DATE%.log', // filename app-logs-20-10-2018
    dirname: `${__basedir}/logs`,  // log directory
    datePattern: 'YYYY-MM-DD', // rotate logs daily
    zippedArchive: true, // gzip the logs afterwards
    maxSize: '10m', // max log size
    maxFiles: '7d', // delete files from disk every week
    handleExceptions: true,
  },
  console: {
    level: 'debug'
  }
}

const fileTransport = new DailyRotateFile(winstonOptions.file);

fileTransport.on('rotate', (oldFilename, newFilename) => {
  // upload file to s3 bucket here and delete it from the drive (or set max days in options)
  console.log(`Rotating Log File ${oldFilename} to ${newFilename}`);
});

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(winstonOptions.console),
    fileTransport
  ],
  exitOnError: false
});

const logger = {
  error: winstonLogger.error,
  warn: winstonLogger.warning,
  info: winstonLogger.info,
  http: winstonLogger.http,
  verbose: winstonLogger.verbose,
  debug: winstonLogger.debug,
  log: winstonLogger.log
};

module.exports = logger;