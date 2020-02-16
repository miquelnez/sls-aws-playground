/**
 * winston-aws-cloudwatch implementation with await wrapper
 *
 * logging methods no longer take a callback,
 * can't reliably use it in some environments (AWS Lambda)
 *
 * https://github.com/winstonjs/winston/issues/1250#issuecomment-452128291
 */
import { get } from "lodash";
import moment from "moment";
import winston from "winston";
// import { format } from "winston";
import CloudWatchTransport from "winston-aws-cloudwatch";

// const { combine, timestamp, printf } = format;
// const technicalFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} *technical* [${level.toUpperCase()}]: ${message}`;
// });
// const anonymizedFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} *anonymized* [${level.toUpperCase()}]: ${message}`;
// });
const now: string = moment().format("L");

export const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: "sls-aws-playground-ANONYMIZED",
      logStreamName: moment().format("L"),
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 1000,
      submissionRetryCount: 1,
      //   batchSize: 20,
      awsConfig: {
        accessKeyId: get(process.env, "CLOUD_WATCH_IAM_KEY_ID"),
        secretAccessKey: get(process.env, "CLOUD_WATCH_IAM_ACCESS_KEY"),
        region: get(process.env, "CLOUD_WATCH_REGION")
      },
      formatLog: function(item) {
        return `${now} *anonymized* [${item.level.toUpperCase()}]: ${
          item.message
        }`;
      }
      //   formatLog: combine(timestamp(), anonymizedFormat)
    })
    // new CloudWatchTransport({
    //   logGroupName: "sls-aws-playground-TECHNICAL",
    //   logStreamName: moment().format("L"),
    //   createLogGroup: true,
    //   createLogStream: true,
    //   submissionInterval: 1000,
    //   submissionRetryCount: 1,
    //   //   batchSize: 20,
    //   awsConfig: {
    //     accessKeyId: get(process.env, "CLOUD_WATCH_IAM_KEY_ID"),
    //     secretAccessKey: get(process.env, "CLOUD_WATCH_IAM_ACCESS_KEY"),
    //     region: get(process.env, "CLOUD_WATCH_REGION")
    //   },
    //     formatLog: function(item) {
    //       return (
    //         item.level + ": " + item.message + " " + JSON.stringify(item.meta)
    //       );
    //     }
    // //   formatLog: combine(timestamp(), technicalFormat)
    // })
  ]
});

export async function lambdaWinstonLogger(
  event,
  context,
  level = "info",
  message = "Hello has a new loggerTechnical log request"
) {
  const logger = winstonLogger;
  logger.on("error", function(err) {
    console.log("logger error", err);
  });
  console.log("logger used");
  logger.log({
    level: level,
    message: message
  });
  await waitForLogger(logger);
}

async function waitForLogger(logger) {
  console.log("waitForLogger");
  const loggerDone = new Promise(resolve => {
    logger.on("finish", resolve);
  });

  const waitForIt = new Promise(resolve => {
    console.log("Starting waitForIt");
    setTimeout(() => {
      console.log("Finished waiting");
      resolve();
    }, 200);
  });

  // alternatively, use end-of-stream https://www.npmjs.com/package/end-of-stream
  // although I haven't tested this
  // const loggerDone = new Promise(resolve => eos(logger, resolve));
  //   logger.end();
  return loggerDone && waitForIt;
}
