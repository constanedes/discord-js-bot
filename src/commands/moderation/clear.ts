import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "clear",
    description: "Deletes a number of messages from the chat",
    permissions: PermissionFlagsBits.ManageMessages,
    options: [
        {
            name: "amount",
            description: "Number of messages to delete (1-100)",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100,
        },
    ],
    run: async ({ interaction, message, getInteger, reply }) => {
        const channel = interaction?.channel ?? message?.channel;
        if (!channel || !("bulkDelete" in channel)) {
            return void (await reply("This channel does not support deleting messages."));
        }
        const deleted = await channel.bulkDelete(getInteger("amount") ?? 5, true);
        await reply(`${deleted.size} messages deleted.`);
    },
});
