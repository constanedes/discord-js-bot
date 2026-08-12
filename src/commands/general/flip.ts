import { Command } from "../../base/Command.js";

export default new Command({
    name: "flip",
    description: "Flips a coin",
    run: ({ interaction, message, reply }) => {
        const author = interaction?.user ?? message?.author;
        return reply(`${author} The coin landed on... **${Math.random() < 0.5 ? "Heads!" : "Tails!"}**`);
    },
});
