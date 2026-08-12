import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "kick",
    description: "Kicks a member from the server",
    permissions: PermissionFlagsBits.KickMembers,
    options: [
        { name: "member", description: "Member to kick", type: ApplicationCommandOptionType.User, required: true },
        { name: "reason", description: "Reason", type: ApplicationCommandOptionType.String },
    ],
    run: async ({ getMember, getString, reply }) => {
        const member = getMember("member");
        if (!member) return void (await reply("That member could not be found."));
        const reason = getString("reason");
        await member.kick(reason);
        await reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Kick!")
                    .setDescription(`${member} has been kicked.${reason ? `\nReason: ${reason}` : ""}`)
                    .setColor("Orange"),
            ],
        });
    },
});
