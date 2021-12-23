import {createLogger, format, transports} from 'winston';

// const {combine, timestamp, label, printf} = format;
const logger = createLogger({
  format: format.combine(
    format.timestamp({format: 'DD-MM-YYYY HH:mm:ss::ms'}),

    format.json()
  ),
  level: 'info',
  transports: [
    new transports.Console(),
    new transports.File({filename: 'combined.log'}),
  ],
});

export {logger};
