import { EmbedBuilder } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "help",
    description: "Shows all available commands",
    run: async ({ client, reply }) => {
        const grouped = new Map<string, Command[]>();
        for (const command of client.commands.values()) {
            grouped.set(command.category, [...(grouped.get(command.category) ?? []), command]);
        }
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("Here are all the commands available:")
            .setColor("Blurple")
            .addFields(
                [...grouped].map(([category, commands]) => ({
                    name: category,
                    value: commands
                        .map((command) => `\`/${command.data.name}\` - ${command.data.description}`)
                        .join("\n"),
                })),
            );
        await reply({ embeds: [embed] });
    },
});
