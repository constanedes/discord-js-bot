import { Client, ClientOptions, IntentsBitField } from "discord.js";

export class CustomClient extends Client {
    // rome-ignore lint/complexity/noUselessConstructor: <explanation>
    constructor(options: ClientOptions) {
        super(options);
    }
}

const client = new CustomClient({
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
