import { Command } from "../../base/Command.js";
import { getSession, voiceSessions } from "../../utils/voice.js";

export default new Command({
    name: "leave",
    description: "Leaves the voice channel",
    run: async ({ interaction, message, reply }) => {
        const guildId = interaction?.guildId ?? message?.guildId;
        const session = getSession(guildId);
        session?.connection.destroy();
        if (guildId) voiceSessions.delete(guildId);
        await reply(session ? "Left the voice channel." : "I am not in a voice channel.");
    },
});
