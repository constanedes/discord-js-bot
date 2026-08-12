import { Events } from "discord.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export default new Event({
    name: Events.GuildMemberRemove,
    async run(_client, member) {
        if (!config.welcomeChannelId) return;
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel?.isTextBased()) await channel.send(`${member.user.username} left ${member.guild.name}.`);
    },
});
