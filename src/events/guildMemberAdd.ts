import { Events } from "discord.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export default new Event({
    name: Events.GuildMemberAdd,
    async run(_client, member) {
        if (!config.welcomeChannelId) return;
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel?.isTextBased()) await channel.send(`Welcome ${member} to ${member.guild.name}!`);
    },
});
