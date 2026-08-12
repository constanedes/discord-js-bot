import { Command } from "../../base/Command.js";
import { getJson } from "../../utils/http.js";

type Meme = { url: string };

export default new Command({
    name: "meme",
    description: "Gets a random meme",
    run: async ({ reply }) => {
        try {
            const meme = await getJson<Meme>("https://meme-api.com/gimme");
            await reply(meme.url);
        } catch {
            await reply("Couldn't fetch a meme right now, try again later!");
        }
    },
});
