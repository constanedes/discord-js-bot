import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

type ComponentProps<Cached extends CacheType = CacheType> = {
    type: "Button",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    run(interaction: ButtonInteraction<Cached>): any;
} | {
    type: "StringSelect",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    run(interaction: StringSelectMenuInteraction<Cached>): any;
} | {
    type: "RoleSelect",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    run(interaction: RoleSelectMenuInteraction<Cached>): any;
} | {
    type: "ChannelSelect",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    run(interaction: ChannelSelectMenuInteraction<Cached>): any;
} | {
    type: "UserSelect",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
run(interaction: UserSelectMenuInteraction<Cached>): any;
} | {
    type: "MentionableSelect",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
run(interaction: MentionableSelectMenuInteraction<Cached>): any;
} | {
    type: "Modal",
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
run(interaction: ModalSubmitInteraction<Cached>): any;
}

export type ComponentData<Cached extends CacheType = CacheType> = ComponentProps<Cached> & {
    cache?: Cached,
    customId: string,
}

export class Component<Cached extends CacheType = CacheType> {
    constructor(public readonly data: ComponentData<Cached>){}
}