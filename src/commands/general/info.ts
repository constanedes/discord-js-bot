import { EmbedBuilder } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "info",
    description: "Shows information about the server",
    run: async ({ interaction, message, reply }) => {
        const guild = interaction?.guild ?? message?.guild;
        if (!guild) return void (await reply("This command can only be used in a server."));
        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setDescription("Server information")
            .setColor("Green")
            .addFields(
                { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
                { name: "Members", value: String(guild.memberCount), inline: true },
                { name: "Roles", value: String(guild.roles.cache.size), inline: true },
                { name: "ID", value: guild.id, inline: true },
            );
        const icon = guild.iconURL();
        if (icon) embed.setThumbnail(icon);
        await reply({ embeds: [embed] });
    },
});
