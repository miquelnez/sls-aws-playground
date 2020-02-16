import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { loggerTechnical } from "./logger";
// import { loggerTechnical, loggerAnonymized } from "./logger";

export const hello: APIGatewayProxyHandler = async (event, _context) => {

  process.on("exit", function() {
    console.log(">> Process is exiting");
  });

  loggerTechnical.log({
    level: "info",
    message: "Hello has a new loggerTechnical log request"
  });

//   loggerAnonymized.log({
//     level: "info",
//     message: "Hello has a new loggerAnonymized log request"
//   });

  loggerTechnical.end();
//   loggerAnonymized.end();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };
};
