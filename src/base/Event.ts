import type { ClientEvents } from "discord.js";
import type { ExtendedClient } from "../client/ExtendedClient.js";

export type EventData<Key extends keyof ClientEvents = keyof ClientEvents> = {
    name: Key;
    once?: boolean;
    run: (client: ExtendedClient, ...args: ClientEvents[Key]) => unknown;
};

export class Event<Key extends keyof ClientEvents = keyof ClientEvents> {
    constructor(public readonly data: EventData<Key>) {}
}
