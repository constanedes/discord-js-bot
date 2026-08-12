import {
    ApplicationCommandOptionType,
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    type GuildMember,
    type InteractionReplyOptions,
    type Message,
    type MessagePayload,
    type MessageReplyOptions,
    type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { ExtendedClient } from "../client/ExtendedClient.js";
import type { Component } from "./Component.js";

export type ReplyContent = string | MessagePayload | InteractionReplyOptions | MessageReplyOptions;

export type CommandContext = {
    client: ExtendedClient;
    interaction?: ChatInputCommandInteraction;
    message?: Message;
    reply: (content: ReplyContent) => Promise<unknown>;
    getString: (name: string) => string | undefined;
    getInteger: (name: string) => number | undefined;
    getBoolean: (name: string) => boolean | undefined;
    getMember: (name: string) => GuildMember | undefined;
};

export type RawContext = {
    client: ExtendedClient;
    interaction?: ChatInputCommandInteraction;
    message?: Message;
    args: string[];
    reply: (content: ReplyContent) => Promise<unknown>;
};

type OptionType =
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Boolean
    | ApplicationCommandOptionType.User;

export type CommandOption = {
    name: string;
    description: string;
    type: OptionType;
    required?: boolean;
    minValue?: number;
    maxValue?: number;
};

export type CommandProps = {
    name: string;
    description: string;
    options?: CommandOption[];
    /** Required permissions, enforced by Discord on slash and by the router on prefix mode. */
    permissions?: bigint;
    ownerOnly?: boolean;
    components?: Component[];
    run: (context: CommandContext) => unknown;
};

export class Command {
    readonly data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    readonly permissions?: bigint;
    readonly ownerOnly: boolean;
    readonly components: Component[];
    readonly options: CommandOption[];
    category = "General";
    private readonly run: CommandProps["run"];

    constructor(props: CommandProps) {
        const builder = new SlashCommandBuilder().setName(props.name).setDescription(props.description);
        if (props.permissions) builder.setDefaultMemberPermissions(props.permissions);
        for (const option of props.options ?? []) addOption(builder, option);
        this.data = builder;
        this.permissions = props.permissions;
        this.ownerOnly = props.ownerOnly ?? false;
        this.components = props.components ?? [];
        this.options = props.options ?? [];
        this.run = props.run;
    }

    /** Executes the command exposing normalized option getters for slash and prefix modes. */
    execute(raw: RawContext): Promise<unknown> {
        return Promise.resolve(this.run({ ...raw, ...this.buildGetters(raw) }));
    }

    private buildGetters({ interaction, message, args }: RawContext) {
        if (interaction) {
            return {
                getString: (name: string) => interaction.options.getString(name) ?? undefined,
                getInteger: (name: string) => interaction.options.getInteger(name) ?? undefined,
                getBoolean: (name: string) => interaction.options.getBoolean(name) ?? undefined,
                getMember: (name: string): GuildMember | undefined => {
                    const user = interaction.options.getUser(name);
                    return user && interaction.guild ? interaction.guild.members.cache.get(user.id) : undefined;
                },
            };
        }
        const values = this.parseArgs(args);
        return {
            getString: (name: string) => values.get(name),
            getInteger: (name: string) => {
                const raw = values.get(name);
                const parsed = raw === undefined ? Number.NaN : Number.parseInt(raw, 10);
                return Number.isNaN(parsed) ? undefined : parsed;
            },
            getBoolean: (name: string) => {
                const raw = values.get(name)?.toLowerCase();
                return raw === undefined ? undefined : ["true", "yes", "1", "si"].includes(raw);
            },
            getMember: (name: string): GuildMember | undefined => {
                const raw = values.get(name);
                const id = raw && (/<@!?(\d+)>/.exec(raw)?.[1] ?? (/^\d+$/.test(raw) ? raw : undefined));
                if (!id) return undefined;
                return message?.mentions.members?.get(id) ?? message?.guild?.members.cache.get(id);
            },
        };
    }

    /** Maps positional prefix args to the declared options; the last string option consumes the rest. */
    private parseArgs(args: string[]): Map<string, string> {
        const values = new Map<string, string>();
        const lastString = this.options.reduce(
            (last, option, index) => (option.type === ApplicationCommandOptionType.String ? index : last),
            -1,
        );
        let index = 0;
        for (const [optionIndex, option] of this.options.entries()) {
            const token = args[index];
            if (token === undefined) break;
            if (optionIndex === lastString) {
                values.set(option.name, args.slice(index).join(" "));
                break;
            }
            values.set(option.name, token);
            index++;
        }
        return values;
    }
}

function addOption(builder: SlashCommandBuilder, option: CommandOption): void {
    const required = option.required ?? false;
    switch (option.type) {
        case ApplicationCommandOptionType.String:
            builder.addStringOption((o) =>
                o.setName(option.name).setDescription(option.description).setRequired(required),
            );
            break;
        case ApplicationCommandOptionType.Integer:
            builder.addIntegerOption((o) => {
                o.setName(option.name).setDescription(option.description).setRequired(required);
                if (option.minValue !== undefined) o.setMinValue(option.minValue);
                if (option.maxValue !== undefined) o.setMaxValue(option.maxValue);
                return o;
            });
            break;
        case ApplicationCommandOptionType.Boolean:
            builder.addBooleanOption((o) =>
                o.setName(option.name).setDescription(option.description).setRequired(required),
            );
            break;
        case ApplicationCommandOptionType.User:
            builder.addUserOption((o) =>
                o.setName(option.name).setDescription(option.description).setRequired(required),
            );
            break;
    }
}
