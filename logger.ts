import winston from "winston";
import { format } from "winston";
import AWS from "aws-sdk";
import WinstonCloudWatch from "winston-cloudwatch";
import moment from "moment";

const { combine, timestamp, printf } = format;
AWS.config.update({
  region: "us-east-1"
});

const technicalFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} *technical* [${level.toUpperCase()}]: ${message}`;
});
const anonymizedFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} *anonymized* [${level.toUpperCase()}]: ${message}`;
});

winston.loggers
  .add("technical", {
    format: combine(timestamp(), technicalFormat),
    transports: [
      new winston.transports.Console(),
      new WinstonCloudWatch({
        cloudWatchLogs: new AWS.CloudWatchLogs(),
        logGroupName: "sls-aws-playground-TECHNICAL",
        logStreamName: moment().format("L")
      })
    ]
  });
  winston.loggers.add("anonymized", {
    format: combine(timestamp(), anonymizedFormat),
    transports: [
      new winston.transports.Console(),
      new WinstonCloudWatch({
        cloudWatchLogs: new AWS.CloudWatchLogs(),
        logGroupName: "sls-aws-playground-ANONYMIZED",
        logStreamName: moment().format("L")
      })
    ]
  });

export const loggerTechnical = winston.loggers.get("technical");
export const loggerAnonymized = winston.loggers.get("anonymized");
