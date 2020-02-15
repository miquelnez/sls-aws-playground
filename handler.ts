import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { logger } from "./logger";

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  logger.log({
    level: "info",
    label: "REQUEST",
    message: "Hello has a new request"
  });
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
