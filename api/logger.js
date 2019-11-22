'use strict';

const { createLogger, format, transports } = require('winston');
const filesystem = require('fs');
const log_dir = 'log';
require('winston-daily-rotate-file');

if (!filesystem.existsSync(log_dir)) {
  filesystem.mkdirSync(log_dir);
}

const daily_rotate_file_transport = new transports.DailyRotateFile
({
  filename: `${log_dir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

switch(process.argv[2]) {
  case 'error':
    var log_level = process.argv[2].toUpperCase();
    break;
  case 'warn':
    var log_level = process.argv[2].toUpperCase();
    break;
  case 'info':
    var log_level = process.argv[2].toUpperCase();
    break;
  case 'debug':
    var log_level = process.argv[2].toUpperCase();
    break;
  default:
    console.log('**** DID NOT SET DEBUG LEVEL ****');
    process.exit(1);  
}

console.log(`**** logging in ${log_level} mode ****`);

module.exports = createLogger({
  level: log_level,
  levels: { 
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  },
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    daily_rotate_file_transport
  ]
});
