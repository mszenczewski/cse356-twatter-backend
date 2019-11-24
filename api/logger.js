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

module.exports = createLogger({
  level: args[0],
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
