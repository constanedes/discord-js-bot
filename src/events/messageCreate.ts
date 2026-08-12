import { Events } from "discord.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export default new Event({
    name: Events.MessageCreate,
    async run(client, message) {
        if (message.author.id === client.user?.id) return;
        const channel = "name" in message.channel ? message.channel.name : "Unknown";
        console.log(`${message.author.tag} said in ${channel}: ${message.content}`);

        if (message.author.bot || !message.content.startsWith(config.prefix)) return;
        const [name, ...args] = message.content.slice(config.prefix.length).trim().split(/\s+/);
        const command = name ? client.commands.get(name.toLowerCase()) : undefined;
        if (!command) return;
        if (command.ownerOnly && message.author.id !== config.ownerId) {
            await message.reply("This command is owner-only.");
            return;
        }
        if (command.permissions && message.member && !message.member.permissions.has(command.permissions)) {
            await message.reply("You don't have permissions to use this command.");
            return;
        }
        try {
            await command.execute({
                client,
                message,
                args,
                reply: (content) => message.reply(content as Parameters<typeof message.reply>[0]),
            });
        } catch (error) {
            console.error(error);
            await message.reply("Something went wrong while running this command.");
        }
    },
});
