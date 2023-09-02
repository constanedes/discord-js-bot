import { ActivityType, Client, Collection, IntentsBitField, Interaction, Partials } from "discord.js";
import path, { join } from "path";
import fs from "fs";
import { Command } from "../base/Command.js";

export default class ExtendedClient extends Client {
    commands: Collection<unknown, unknown> | undefined;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
                Partials.ThreadMember,
                Partials.Reaction,
                Partials.GuildScheduledEvent,
            ],

            presence: { activities: [{ name: "AFK | !help", type: ActivityType.Playing }], status: "idle", afk: true },
        });
    }

    public async start() {
        //await this.loadEvents();
        // await this.loadComponents(); // TODO uncoment
        //await this.loadCommands();

        this.login(process.env.BOT_TOKEN);
        this.on("interactionCreate", this.addListeners);
        this.once("ready", this.onReady);
    }
    private addListeners(interaction: Interaction) {
        //if (interaction.isCommand()) this.onCommand(interaction);
        //if (interaction.isAutocomplete()) this.onAutoComplete(interaction);
    }
    
    /* 
    private async onCommand(commandInteraction: CommandInteraction){
        const command = this.Commands.get(commandInteraction.commandName);
        const client = this as ExtendedClient;

        switch(command?.type){
            case ApplicationCommandType.ChatInput:{
                const interaction = commandInteraction as ChatInputCommandInteraction;
                command.run({ interaction, client });
                return;
            }
            case ApplicationCommandType.Message:{
                const interaction = commandInteraction as MessageContextMenuCommandInteraction;
                command.run({ interaction, client });
                return;
            }
            case ApplicationCommandType.User:{
                const interaction = commandInteraction as UserContextMenuCommandInteraction;
                command.run({ interaction, client });
                return;
            }
        }

    } */

    //* Delete
    private async onReady(): Promise<void> {
        this.commands = new Collection();

        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try {
                const { default: command } = await import(filePath);
                if ("data" in command && "execute" in command) {
                    this.commands.set(command.data.name, command);
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                    );
                }
            } catch (error) {
                console.error(`Error loading command from ${filePath}: ${error}`);
            }
        }
    }
    /*
    private async loadCommands() {
        const commandsDir = join(__dirname, "../commands");
        const paths = await getFiles(commandsDir);

        const messages: string[] = [ck.bgBlue(" Commands ")];

        for (const path of paths) {
            const { default: command } = await import(join(commandsDir, path));
            if (!(command instanceof Command)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Command")));
                continue;
            }

            this.Commands.set(command.data.name, command.data);
            messages.push(
                `${ck.green("✓")} ${ck.blue.underline(path)} ${ck.green(`registered as ${ck.cyan(command.data.name)}`)}`
            );

            if (command.data.components) {
                command.data.components.forEach((c) => this.saveComponent(c));
            }
        }
        console.log(messages.join("\n"));
    }

    
    private async loadEvents() {
        const eventsDir = join(__dirname, "../events");
        const paths = await getFiles(eventsDir);

        const messages: string[] = [ck.bgYellow.black(" Events ")];

        for (const path of paths) {
            const { default: event } = await import(join(eventsDir, path));
            if (!(event instanceof Event)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Event")));
                continue;
            }
            const client = this as ExtendedClient<true>;
            const { name, run, once } = event.data;
            if (once) {
                this.once(name, (...args) => run(client, ...args));
            } else {
                this.on(name, (...args) => run(client, ...args));
            }

            messages.push(
                `${ck.green("✓")} ${ck.yellow.underline(path)} ${ck.green(`registered as ${ck.cyan(event.data.name)}`)}`
            );
        }

        console.log(messages.join("\n"));
    }

    private async loadComponents(){
        const componentsDir = join(__dirname, "../components");
        const paths = await getFiles(componentsDir);

        const messages: string[] = [ck.bgGreenBright.black(" Components ")];

        for (const path of paths){
            const { default: component } = await import(join(componentsDir, path));
            if (!(component instanceof Component)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Component")));
                continue;
            }

            this.saveComponent(component);
            messages.push(`${ck.green("✓")} ${ck.greenBright.underline(path)} ${ck.green(`registered as ${ck.cyan(component.data.customId)}`)}`);
        }        
        console.log(messages.join("\n"));
    } 

    private async saveComponent({ data: component }: Component){
        switch (component.type) {
            case "Button": this.Buttons.set(component.customId, component);
                break;
            case "StringSelect": this.StringSelects.set(component.customId, component);
                break;
            case "RoleSelect": this.RoleSelect.set(component.customId, component);
                break;
            case "ChannelSelect": this.ChannelSelects.set(component.customId, component);
                break;
            case "UserSelect": this.UserSelects.set(component.customId, component);
                break;
            case "MentionableSelect": this.MentionableSelects.set(component.customId, component);
                break;
            case "Modal": this.Modals.set(component.customId, component);
                break;
        }
    }
    private async registerListeners(interaction: Interaction){
        if (interaction.isCommand()) this.onCommand(interaction);
        if (interaction.isAutocomplete()) this.onAutoComplete(interaction);

        if (interaction.isModalSubmit()){
            this.Modals.get(interaction.customId)?.run(interaction);
            return;
        }

        if (interaction.isMessageComponent()){
            switch(interaction.componentType){
                case ComponentType.Button: this.Buttons.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.StringSelect: this.StringSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.UserSelect: this.UserSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.RoleSelect: this.RoleSelect.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.MentionableSelect: this.MentionableSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.ChannelSelect: this.ChannelSelects.get(interaction.customId)?.run(interaction);
                    break;
            }
            return;
        }
    }
    private onAutoComplete(autoCompleteInteraction: AutocompleteInteraction) {
        const command = this.Commands.get(autoCompleteInteraction.commandName);
        const client = this as ExtendedClient<true>;
        const interaction = autoCompleteInteraction as AutocompleteInteraction;
        if (command?.type === ApplicationCommandType.ChatInput && command.autoComplete){
            command.autoComplete({ client, interaction });
        }
    }
    
    
    private async whenReady(client: Client<true>) {
        const messages: string[] = [];

        messages.push(
            `${ck.green("✓ Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)}`,
            `${ck.greenBright(`➝ Connected with ${ck.underline(client.user.username)}`)}`
        );

        await client.application.commands
            .set(Array.from(this.Commands.values()))
            .then((c) => messages.push(`${ck.cyan("⟨ / ⟩")} ${ck.green(`${c.size} commands defined successfully!`)}`))
            .catch(({ message }: DiscordAPIError) =>
                messages.push(
                    brBuilder(
                        "",
                        ck.bgRed.white(" ✗ An error occurred while trying to set the commands "),
                        ck.red("Message:", message)
                    )
                )
            );

        console.log(brBuilder("", ...messages));
    }
    */
}
