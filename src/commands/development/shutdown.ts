import { Command } from "../../base/Command.js";

export default new Command({
    name: "shutdown",
    description: "Shuts the bot down",
    ownerOnly: true,
    run: async ({ client, reply }) => {
        await reply("Shutting down...");
        client.destroy();
    },
});
