import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import { ChannelType } from "discord.js";
import { Command } from "../../base/Command.js";
import { voiceSessions } from "../../utils/voice.js";

export default new Command({
    name: "join",
    description: "Joins your voice channel",
    run: async ({ interaction, message, reply }) => {
        const member = interaction?.member ?? message?.member;
        const channel = member && "voice" in member ? member.voice.channel : undefined;
        if (!channel || channel.type !== ChannelType.GuildVoice) {
            return void (await reply("Join a voice channel first."));
        }
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const player = createAudioPlayer();
        connection.subscribe(player);
        voiceSessions.set(channel.guild.id, { connection, player });
        await reply("Joined your voice channel.");
    },
});
