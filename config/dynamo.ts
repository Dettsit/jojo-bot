import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "./env.ts";

const client = new DynamoDBClient({
    region: env.awsRegion,
    ...(env.dynamoEndpoint ? { endpoint: env.dynamoEndpoint } : {}),
    credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
    },
});

export const dynamo = DynamoDBDocumentClient.from(client);
