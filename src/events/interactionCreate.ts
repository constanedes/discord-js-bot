import { Events } from "discord.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export default new Event({
    name: Events.InteractionCreate,
    async run(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            if (command.ownerOnly && interaction.user.id !== config.ownerId) {
                await interaction.reply({ content: "This command is owner-only.", ephemeral: true });
                return;
            }
            try {
                await command.execute({
                    client,
                    interaction,
                    args: [],
                    reply: (content) => interaction.reply(content as Parameters<typeof interaction.reply>[0]),
                });
            } catch (error) {
                console.error(error);
                const payload = { content: "Something went wrong while running this command.", ephemeral: true };
                if (interaction.replied || interaction.deferred) await interaction.followUp(payload);
                else await interaction.reply(payload);
            }
            return;
        }

        try {
            if (interaction.isButton()) await client.buttons.get(interaction.customId)?.data.run(interaction);
            else if (interaction.isStringSelectMenu())
                await client.selects.get(interaction.customId)?.data.run(interaction);
            else if (interaction.isModalSubmit()) await client.modals.get(interaction.customId)?.data.run(interaction);
        } catch (error) {
            console.error(error);
        }
    },
});
