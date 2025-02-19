// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

// import * as sst from "@serverless-stack/resources";

export default $config({
  app(input) {
    return {
      name: "projectmanagementapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // Create the secrets
    const authDiscordId = new sst.Secret("AUTH_DISCORD_ID");
    const authDiscordSecret = new sst.Secret("AUTH_DISCORD_SECRET");
    const authSecret = new sst.Secret("AUTH_SECRET");
    const databaseUrl = new sst.Secret("DATABASE_URL");
    const nextAuthUrl = new sst.Secret("NEXTAUTH_URL");
    const nextPublicUrl = new sst.Secret("NEXT_PUBLIC_URL");
    // Create the Next.js app and link the secrets
    const web = new sst.aws.Nextjs("MyWeb", {
      environment: {
        AUTH_DISCORD_ID: authDiscordId.value,
        AUTH_DISCORD_SECRET: authDiscordSecret.value,
        AUTH_SECRET: authSecret.value,
        DATABASE_URL: databaseUrl.value,
        NEXTAUTH_URL: nextAuthUrl.value,
        NEXT_PUBLIC_URL: nextPublicUrl.value,
      },
      // Optionally, link the secrets to the app as needed
      link: [authDiscordId, authDiscordSecret, authSecret, databaseUrl,nextAuthUrl, nextPublicUrl],
    });
    
  },
});
