import { createLogger, format, transports } from "winston";
// import AWS from 'aws-sdk';
// import WinstonCloudWatch from 'winston-cloudwatch';

const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [new transports.Console()]
});

// winston-cloudwatch
// AWS.config.update({
//   region: 'us-east-1',
// });

// winston.add(new WinstonCloudWatch({
//   cloudWatchLogs: new AWS.CloudWatchLogs(),
//   logGroupName: 'testing',
//   logStreamName: 'first'
// }));
