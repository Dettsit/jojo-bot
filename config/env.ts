export const env = {
    awsRegion: Deno.env.get("AWS_REGION") ?? "us-east-1",
    awsAccessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") ?? "",
    awsSecretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "",
    dynamoEndpoint: Deno.env.get("DYNAMO_ENDPOINT"),
    tableInfoStands: Deno.env.get("DYNAMO_TABLE_INFO_STANDS") ?? "jojo-bot-info-stands",
    tableOwnedStands: Deno.env.get("DYNAMO_TABLE_OWNED_STANDS") ?? "jojo-bot-owned-stands",
    tableInventory: Deno.env.get("DYNAMO_TABLE_INVENTORY") ?? "jojo-bot-inventory",
    discordAppId: Deno.env.get("DISCORD_APP_ID") ?? "",
    discordBotToken: Deno.env.get("DISCORD_BOT_TOKEN") ?? "",
    discordChannelId: Deno.env.get("DISCORD_CHANNEL_ID") ?? "",
    discordPublicKey: Deno.env.get("DISCORD_PUBLIC_KEY") ?? "",
    apiSecret: Deno.env.get("API_SECRET") ?? "",
};
