import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "say",
    description: "Makes the bot repeat a message",
    options: [{ name: "message", description: "Message", type: ApplicationCommandOptionType.String, required: true }],
    run: ({ getString, reply }) => reply(getString("message") ?? ""),
});
