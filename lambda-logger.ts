/**
 * logging methods no longer take a callback,
 * can't reliably use it in some environments (AWS Lambda)
 *
 * https://github.com/winstonjs/winston/issues/1250#issuecomment-452128291
 */
import winston from "winston";
import { format } from "winston";
import AWS from "aws-sdk";
import WinstonCloudWatch from "winston-cloudwatch";
import moment from "moment";
import { get } from "lodash";

const { combine, timestamp, printf } = format;
AWS.config.update({
  region: get(process.env, "CLOUD_WATCH_REGION")
});

const technicalFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} *technical* [${level.toUpperCase()}]: ${message}`;
});

async function waitForLogger(logger) {
  console.log("waitForLogger");
  //   const loggerDone = new Promise(resolve => logger.on("finish", resolve));
  // alternatively, use end-of-stream https://www.npmjs.com/package/end-of-stream
  // although I haven't tested this
  // const loggerDone = new Promise(resolve => eos(logger, resolve));
  logger.on("finish", function() {
    console.log("logger is finish logging");
    // process.exit(0);
    logger.end();
    return true;
  });

  logger.on("flush", function() {
    console.log("logger is flush logging");
    logger.end();
    return true;
  });
  //   logger.end();
  //   return loggerDone;
}

export async function lambdaHandler(event, context) {
  const logger = winston.createLogger({
    format: combine(timestamp(), technicalFormat),
    transports: [
      // new winston.transports.Console(),
      new WinstonCloudWatch({
        cloudWatchLogs: new AWS.CloudWatchLogs(),
        logGroupName: "sls-aws-playground-TECHNICAL",
        logStreamName: moment().format("L"),
        awsAccessKeyId: get(process.env, "CLOUD_WATCH_IAM_KEY_ID"),
        awsSecretKey: get(process.env, "CLOUD_WATCH_IAM_ACCESS_KEY"),
        awsRegion: get(process.env, "CLOUD_WATCH_REGION")
      })
    ]
  });
  logger.on("error", function(err) {
    console.log("logger error", err);
  });
  console.log("logger used");
  logger.log("info", "some message");
  logger.error('1');
//   await waitForLogger(logger);
}
