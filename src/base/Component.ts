import type { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";

export type ComponentInteraction = ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction;

export type ComponentData = {
    customId: string;
    type: "Button" | "StringSelect" | "Modal";
    run: (interaction: ComponentInteraction) => unknown;
};

export class Component {
    constructor(public readonly data: ComponentData) {}
}
