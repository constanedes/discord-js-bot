import play from "play-dl";
import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../base/Command.js";

export default new Command({
    name: "yt",
    description: "Searches YouTube and returns the first result",
    options: [
        { name: "query", description: "Search query", type: ApplicationCommandOptionType.String, required: true },
    ],
    run: async ({ getString, reply }) => {
        const query = getString("query");
        if (!query) return;
        try {
            const [result] = await play.search(query, { limit: 1 });
            await reply(result?.url ?? "No YouTube result found.");
        } catch {
            await reply("YouTube search is unavailable right now.");
        }
    },
});
