const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const stringify = require('json-stringify-safe');
const aws = require('../aws/index');
const config = require('../../config/index');
const path = require('path');
const fs = require('fs');

const customFormat = winston.format.printf(log => {
  if(typeof(log.message) === typeof({})) {
    log.message = stringify(log.message, null, 2);
  };

  return `${log.timestamp} [${log.level}]: ${log.message} ${log.meta ? '=> ' + stringify(log.meta, null, 2) : ''}`;
});

var winstonOptions = {
  file: {
    level: 'info',
    filename: 'app-logs-%DATE%.log', // filename app-logs-20-10-2018
    dirname: `${__basedir}/logs`,  // log directory
    datePattern: 'YYYY-MM-DD', // rotate logs daily
    zippedArchive: false, // don't zip for now
    maxSize: '10m', // max log size = 10mb
    maxFiles: '7d', // delete files after 7 days
    handleExceptions: true,
  },
  console: {
    level: 'debug'
  }
}

const fileTransport = new DailyRotateFile(winstonOptions.file);

fileTransport.on('rotate', (oldFilename, newFilename) => {
  // upload file to s3 bucket
  const fileParams = {
    Bucket: config.logger.BUCKET_NAME,
    Key: `winston-node-app/${path.basename(oldFilename)}`,
    Body: fs.createReadStream(oldFilename)
  };

  aws.s3.upload(fileParams, (res) => {
    if(res) {
      logger.info(`LOGGER: Old Log file uploaded to s3 successfully (${path.basename(oldFilename)})`);
      logger.info(`LOGGER: New Log file (${path.basename(newFilename)}) in action`)
    } else {
      logger.error(`LOGGER: Log File not uploaded (${path.basename(oldFilename)})`);
      // copy the file as backup to upload later manually
      fs.createReadStream(oldFilename).pipe(fs.createWriteStream(`${oldFilename}.backup`));
    }
  });
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