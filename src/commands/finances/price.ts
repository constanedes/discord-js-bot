import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../base/Command.js";
import { SUPPORTED_FIAT, fetchPrice, resolveCoinId } from "../../utils/coingecko.js";

export default new Command({
    name: "price",
    description: "Shows the current price of a cryptocurrency",
    options: [
        {
            name: "crypto",
            description: "Cryptocurrency symbol or CoinGecko id",
            type: ApplicationCommandOptionType.String,
        },
        { name: "fiat", description: "Fiat currency to convert to", type: ApplicationCommandOptionType.String },
        { name: "changes", description: "Show 24h percentage change", type: ApplicationCommandOptionType.Boolean },
    ],
    run: async ({ getString, getBoolean, reply }) => {
        const symbol = (getString("crypto") ?? "BTC").toUpperCase();
        const fiat = (getString("fiat") ?? "USD").toUpperCase();
        if (!SUPPORTED_FIAT.has(fiat)) return void (await reply(`The fiat currency ${fiat} is not supported!`));
        try {
            const id = resolveCoinId(symbol);
            const data = await fetchPrice(id, fiat);
            const price = data[id]?.[fiat.toLowerCase()];
            if (price === undefined) return void (await reply(`No price data found for ${symbol}!`));
            const change = data[id]?.[`${fiat.toLowerCase()}_24h_change`];
            const suffix = getBoolean("changes") ? `\n24h: ${change?.toFixed(2)}%` : "";
            await reply(
                `The price of **${symbol}** is **${price.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${fiat}**.${suffix}`,
            );
        } catch {
            await reply("CoinGecko is unavailable right now, try again later.");
        }
    },
});
