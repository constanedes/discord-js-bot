import { readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { Command } from "../base/Command.js";
import { Component } from "../base/Component.js";
import { Event } from "../base/Event.js";
import { config } from "../config.js";

export class ExtendedClient extends Client {
    readonly commands = new Collection<string, Command>();
    readonly buttons = new Collection<string, Component>();
    readonly selects = new Collection<string, Component>();
    readonly modals = new Collection<string, Component>();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ],
            partials: [Partials.Channel],
        });
    }

    async start(): Promise<void> {
        await this.loadCommands();
        await this.loadEvents();
        await this.login(config.token);
    }

    /** Discovers every command under src/commands; the parent folder becomes the category. */
    private async loadCommands(): Promise<void> {
        for (const file of walk(resolveModuleDir("commands"))) {
            const module = await importDefault(file);
            if (!(module instanceof Command)) {
                console.warn(`Skipping ${file}: it does not export a Command`);
                continue;
            }
            module.category = capitalize(basename(dirname(file)));
            this.commands.set(module.data.name, module);
            for (const component of module.components) this.registerComponent(component);
        }
        console.log(`Loaded ${this.commands.size} commands`);
    }

    private async loadEvents(): Promise<void> {
        for (const file of walk(resolveModuleDir("events"))) {
            const module = await importDefault(file);
            if (!(module instanceof Event)) {
                console.warn(`Skipping ${file}: it does not export an Event`);
                continue;
            }
            const { name, once, run } = module.data;
            const listener = (...args: unknown[]) => void run(this, ...(args as never[]));
            this.registerListener(name, listener, once ?? false);
        }
    }

    private registerListener(name: string, listener: (...args: unknown[]) => void, once: boolean): void {
        const emitter = this as unknown as {
            on: (event: string, listener: (...args: unknown[]) => void) => void;
            once: (event: string, listener: (...args: unknown[]) => void) => void;
        };
        if (once) emitter.once(name, listener);
        else emitter.on(name, listener);
    }

    private registerComponent(component: Component): void {
        switch (component.data.type) {
            case "Button":
                this.buttons.set(component.data.customId, component);
                break;
            case "StringSelect":
                this.selects.set(component.data.customId, component);
                break;
            case "Modal":
                this.modals.set(component.data.customId, component);
                break;
        }
    }
}

/** Directory next to the compiled file: src/<name> in dev (tsx) and dist/<name> in prod. */
function resolveModuleDir(name: string): string {
    return join(dirname(fileURLToPath(import.meta.url)), "..", name);
}

function* walk(dir: string): Generator<string> {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (/\.(ts|js)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) yield path;
    }
}

async function importDefault(file: string): Promise<unknown> {
    const module = (await import(pathToFileURL(file).href)) as { default: unknown };
    return module.default;
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
