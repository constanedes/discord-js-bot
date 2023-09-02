/* import { ClientEvents } from "discord.js";
import ExtendedClient from "../client/index.js";

export interface EventData<Key extends keyof ClientEvents> {
    name: Key,
    once?: boolean,
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    run(client: ExtendedClient<true>, ...args: ClientEvents[Key]): any,
}

export class Event<Key extends keyof ClientEvents> {
    constructor(public data: EventData<Key>){}
} */