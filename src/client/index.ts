import { Client, IntentsBitField } from "discord.js";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === "ping") {
        message.channel.send(
            `🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
        );
    }
});

export default client;
