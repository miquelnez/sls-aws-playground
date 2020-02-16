import { lambdaWinstonLogger } from "./winston-logger";

// export const hello: APIGatewayProxyHandler = async (event, _context) => {
export async function hello(event: any, _context): Promise<any> {
  process.on("exit", function() {
    console.log(">> Process is exiting");
  });

  console.log('before lambdaWinstonLogger');
  await lambdaWinstonLogger(event, _context, 'info', 'Hello lambdaWinstonLogger');
  console.log('after lambdaWinstonLogger');

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
