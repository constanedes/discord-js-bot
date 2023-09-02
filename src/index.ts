import { IntentsBitField, Partials } from "discord.js";
import ExtendedClient from "./client/ExtendedClient.js";
import client from "./client/ExtendedClient.js";
import { ENV } from "./consts.js";

function main() {
    const client = new ExtendedClient();
    client.login(ENV.DISCORD_TOKEN);
    console.log("Running...");
}

try {
    main();
} catch (error) {
    console.log(error);
}
