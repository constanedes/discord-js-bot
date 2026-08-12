import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../base/Command.js";
import { fetchCoin, resolveCoinId } from "../../utils/coingecko.js";

export default new Command({
    name: "coin",
    description: "Shows detailed information about a cryptocurrency",
    options: [
        {
            name: "crypto",
            description: "Cryptocurrency symbol or CoinGecko id",
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async ({ getString, reply }) => {
        const symbol = (getString("crypto") ?? "BTC").toUpperCase();
        try {
            const data = await fetchCoin(resolveCoinId(symbol));
            const market = data.market_data;
            const embed = new EmbedBuilder()
                .setTitle(`${data.name} (${data.symbol.toUpperCase()})`)
                .setColor("Blurple")
                .addFields(
                    { name: "Price", value: `$${market?.current_price?.usd?.toLocaleString() ?? "N/A"}`, inline: true },
                    { name: "Rank", value: String(market?.market_cap_rank ?? "N/A"), inline: true },
                    {
                        name: "Market cap",
                        value: `$${market?.market_cap?.usd?.toLocaleString() ?? "N/A"}`,
                        inline: true,
                    },
                    {
                        name: "24h change",
                        value: `${market?.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%`,
                        inline: true,
                    },
                )
                .setFooter({ text: "Powered by CoinGecko" });
            if (data.image?.large) embed.setThumbnail(data.image.large);
            await reply({ embeds: [embed] });
        } catch {
            await reply("CoinGecko is unavailable or that coin does not exist.");
        }
    },
});
