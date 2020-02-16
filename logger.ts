import winston from "winston";
import { format } from "winston";
import AWS from "aws-sdk";
import WinstonCloudWatch from "winston-cloudwatch";
import moment from "moment";
import { get } from "lodash";

const { combine, timestamp, printf } = format;
AWS.config.update({
  region: get(process.env, 'CLOUD_WATCH_REGION')
});

const technicalFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} *technical* [${level.toUpperCase()}]: ${message}`;
});
// const anonymizedFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} *anonymized* [${level.toUpperCase()}]: ${message}`;
// });

winston.loggers.add("technical", {
  format: combine(timestamp(), technicalFormat),
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      cloudWatchLogs: new AWS.CloudWatchLogs(),
      logGroupName: "sls-aws-playground-TECHNICAL",
      logStreamName: moment().format("L"),
        awsAccessKeyId: get(process.env, 'CLOUD_WATCH_IAM_KEY_ID'),
        awsSecretKey: get(process.env, 'CLOUD_WATCH_IAM_ACCESS_KEY'),
        awsRegion: get(process.env, 'CLOUD_WATCH_REGION')
    })
  ]
});
// winston.loggers.add("anonymized", {
//   format: combine(timestamp(), anonymizedFormat),
//   transports: [
//     new winston.transports.Console(),
//     new WinstonCloudWatch({
//       cloudWatchLogs: new AWS.CloudWatchLogs(),
//       logGroupName: "sls-aws-playground-ANONYMIZED",
//       logStreamName: moment().format("L"),
//       awsAccessKeyId: get(process.env, 'CLOUD_WATCH_IAM_KEY_ID'),
//       awsSecretKey: get(process.env, 'CLOUD_WATCH_IAM_ACCESS_KEY'),
//       awsRegion: get(process.env, 'CLOUD_WATCH_REGION')
//     })
//   ]
// });

winston.loggers.get("technical").on('finish', function () {
    console.log('technical logger is done logging');
    process.exit(0);
});
winston.loggers.get("technical").on('error', function (err) {
    console.log('technical logger is broken', err);
    process.exit(0);
});

// winston.loggers.get("anonymized").on('finish', function () {
//     console.log('technical logger is done logging');
// });
// winston.loggers.get("anonymized").on('error', function (err) {
//     console.log('anonymized logger is broken', err);
// });

winston.loggers.get("technical").on('flush', function() {
    process.exit(0);
});

console.log('technical transports', winston.loggers.get("technical").transports);


export const loggerTechnical = winston.loggers.get("technical");
// export const loggerAnonymized = winston.loggers.get("anonymized");

// loggerTechnical.on('finish', function (info) {
//     console.log('loggerTechnical finished');
//     this.end();
// });
// loggerAnonymized.on('finish', function (info) {
//     console.log('loggerTechnical finished');
//     this.end();
// });

