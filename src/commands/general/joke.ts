import { Command } from "../../base/Command.js";
import { getJson } from "../../utils/http.js";

type Joke = { setup: string; punchline: string };

export default new Command({
    name: "joke",
    description: "Gets a random joke",
    run: async ({ interaction, message, reply }) => {
        try {
            const joke = await getJson<Joke>("https://official-joke-api.appspot.com/random_joke");
            const author = interaction?.user ?? message?.author;
            await reply(`${author} Here is your joke:\n>>> **${joke.setup}**\n*${joke.punchline}*`);
        } catch {
            await reply("Couldn't fetch a joke right now, try again later!");
        }
    },
});
