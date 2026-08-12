import { Command } from "../../base/Command.js";
import { getSession } from "../../utils/voice.js";

export default new Command({
    name: "skip",
    description: "Skips the current track",
    run: async ({ interaction, message, reply }) => {
        const session = getSession(interaction?.guildId ?? message?.guildId);
        if (!session) return void (await reply("There is no active player."));
        session.player.stop(true);
        await reply("Skipped.");
    },
});
