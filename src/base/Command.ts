import {  ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, Component, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import ExtendedClient  from "../client/ExtendedClient.js";

type CommandProps<DmPermission extends boolean> =
{
    type: ApplicationCommandType.ChatInput,
    autoComplete?(props: {
        client: ExtendedClient,
        interaction: DmPermission extends false 
        ? AutocompleteInteraction<"cached">
        : AutocompleteInteraction
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
}): any
    run(props: {
        client: ExtendedClient,
        interaction: DmPermission extends false 
        ? ChatInputCommandInteraction<"cached">
        : ChatInputCommandInteraction
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
}): any
} | {
    type: ApplicationCommandType.User,
    run(props: {
        client: ExtendedClient,
        interaction: DmPermission extends false 
        ? UserContextMenuCommandInteraction<"cached">
        : UserContextMenuCommandInteraction,
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
}): any
} | {
    type: ApplicationCommandType.Message,
    run(props: { 
        client: ExtendedClient,
        interaction: DmPermission extends false 
        ? MessageContextMenuCommandInteraction<"cached">
        : MessageContextMenuCommandInteraction
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
}): any
}



type CommandData<DmPermission extends boolean> = {
    dmPermission: DmPermission,
    components?: Component[]
}

export class Command<DmPermission extends boolean = boolean>{
    constructor(public data: CommandData<DmPermission>){}
}