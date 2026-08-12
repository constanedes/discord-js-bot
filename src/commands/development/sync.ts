import { Command } from "../../base/Command.js";

export default new Command({
    name: "sync",
    description: "Syncs slash commands with Discord",
    ownerOnly: true,
    run: async ({ client, reply }) => {
        const synced = await client.application?.commands.set(
            [...client.commands.values()].map((command) => command.data),
        );
        await reply(`Synced ${synced?.size ?? 0} commands.`);
    },
});
