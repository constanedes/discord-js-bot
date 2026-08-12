import { Command } from "../../base/Command.js";

export default new Command({
    name: "ping",
    description: "Shows the bot latency",
    run: ({ client, interaction, reply }) =>
        reply(
            `Pong! ${interaction ? Date.now() - interaction.createdTimestamp : Math.round(client.ws.ping)}ms. API latency: ${Math.round(client.ws.ping)}ms`,
        ),
});
