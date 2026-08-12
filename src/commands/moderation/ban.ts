import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "ban",
    description: "Bans a member from the server",
    permissions: PermissionFlagsBits.BanMembers,
    options: [
        { name: "member", description: "Member to ban", type: ApplicationCommandOptionType.User, required: true },
        { name: "reason", description: "Reason", type: ApplicationCommandOptionType.String },
    ],
    run: async ({ getMember, getString, reply }) => {
        const member = getMember("member");
        if (!member) return void (await reply("That member could not be found."));
        const reason = getString("reason");
        await member.ban({ reason });
        await reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ban!")
                    .setDescription(`${member} has been banned.${reason ? `\nReason: ${reason}` : ""}`)
                    .setColor("Red"),
            ],
        });
    },
});
