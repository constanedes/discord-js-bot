import { ActivityType, Events, REST, Routes } from "discord.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export default new Event({
    name: Events.ClientReady,
    once: true,
    async run(client, ready) {
        ready.user.setActivity("/help", { type: ActivityType.Listening });
        const body = [...client.commands.values()].map((command) => command.data.toJSON());
        const route = config.devGuildId
            ? Routes.applicationGuildCommands(ready.user.id, config.devGuildId)
            : Routes.applicationCommands(ready.user.id);
        const rest = new REST({ version: "10" }).setToken(config.token);
        await rest.put(route, { body });
        console.log(`${ready.user.tag} is online. Synced ${body.length} slash commands.`);
    },
});
