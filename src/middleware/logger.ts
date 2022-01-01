import {createLogger, format, transports} from 'winston';

// const {combine, timestamp, label, printf} = format;
const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({format: timezoned}),
    format.prettyPrint()
  ),
  level: process.env.LOG_LEVEl || 'info',
  transports: [
    new transports.Console(),
    new transports.File({filename: 'combined.log', level: 'debug'}),
  ],
});

export {logger};
