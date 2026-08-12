import { ExtendedClient } from "./client/ExtendedClient.js";

const client = new ExtendedClient();

process.on("SIGINT", () => client.destroy());
process.on("SIGTERM", () => client.destroy());

await client.start();
