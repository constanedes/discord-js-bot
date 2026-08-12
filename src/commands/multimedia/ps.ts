import { Command } from "../../base/Command.js";
import { getSession } from "../../utils/voice.js";

export default new Command({
    name: "ps",
    description: "Pauses music",
    run: async ({ interaction, message, reply }) => {
        const session = getSession(interaction?.guildId ?? message?.guildId);
        if (!session) return void (await reply("There is no active player."));
        session.player.pause();
        await reply("Paused.");
    },
});
