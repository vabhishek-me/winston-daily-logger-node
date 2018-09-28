const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const stringify = require('json-stringify-safe');
const aws = require('../aws/index');
const config = require('../../config/index');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

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
    zippedArchive: false, // will zip in the on('rotate') function
    maxSize: '10m', // max log size = 10mb
    maxFiles: null, // will delete the files on('rotate')
    handleExceptions: true,
  },
  console: {
    level: 'debug'
  }
}

const fileTransport = new DailyRotateFile(winstonOptions.file);

fileTransport.on('rotate', (oldFilename, newFilename) => {
  const gzFile = `${oldFilename}.gz`;

  // gzip the file
  var gzip = zlib.createGzip();
  var inp = fs.createReadStream(oldFilename);
  var out = fs.createWriteStream(gzFile);
  inp.pipe(gzip).pipe(out).on('finish', function () {
      fs.unlinkSync(oldFilename);
  });

  // uptil here, the file is saved to disc successfully

  // upload file to s3 bucket
  const fileParams = {
    Bucket: config.logger.BUCKET_NAME,
    Key: `winston-node-app/${path.basename(gzFile)}`,
    Body: fs.createReadStream(gzFile)
  };

  aws.s3.upload(fileParams, (res) => {
    if(res) {
      logger.info(`LOGGER: Old Log file uploaded to s3 successfully (${path.basename(gzFile)})`);
      logger.info(`LOGGER: New Log file (${path.basename(newFilename)}) in action`)
      // remove the gzipped file from disk
      fs.unlinkSync(gzFile);
    } else {
      logger.error(`LOGGER: Log File not uploaded (${path.basename(gzFile)}) - upload it manually`);
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