import { AudioPlayerStatus, createAudioResource, entersState } from "@discordjs/voice";
import play from "play-dl";
import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../base/Command.js";
import { getSession } from "../../utils/voice.js";

export default new Command({
    name: "play",
    description: "Plays audio from a URL",
    options: [{ name: "url", description: "Audio URL", type: ApplicationCommandOptionType.String, required: true }],
    run: async ({ interaction, message, getString, reply }) => {
        const session = getSession(interaction?.guildId ?? message?.guildId);
        const url = getString("url");
        if (!session || !url) return void (await reply("Use /join first and provide a URL."));
        try {
            const stream = await play.stream(url);
            session.player.play(createAudioResource(stream.stream, { inputType: stream.type }));
            await entersState(session.player, AudioPlayerStatus.Playing, 10_000);
            await reply("Playing.");
        } catch {
            await reply("I could not play that URL.");
        }
    },
});
