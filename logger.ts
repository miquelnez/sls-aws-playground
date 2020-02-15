import winston from 'winston';
// import AWS from 'aws-sdk';
// import WinstonCloudWatch from 'winston-cloudwatch';

export const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
    //   new winston.transports.File({ filename: 'combined.log' })
    ]
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
