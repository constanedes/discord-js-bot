import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, codeBlock } from "discord.js";
import { Command } from "../../base/Command.js";
import { Component } from "../../base/Component.js";

const HELLO_LANGUAGES: Record<string, string> = {
    ts: 'console.log("Hello, World!");',
    js: 'console.log("Hello, World!");',
    py: 'print("Hello, World!")',
    lua: 'print("Hello, World!")',
    rb: 'puts "Hello, World!"',
    java: [
        "public class HelloWorld {",
        "    public static void main(String[] args) {",
        '        System.out.println("Hello, World!");',
        "    }",
        "}",
    ].join("\n"),
    cs: [
        "using System;",
        "",
        "class Program {",
        "    static void Main() {",
        '        Console.WriteLine("Hello, World!");',
        "    }",
        "}",
    ].join("\n"),
    cpp: [
        "#include <iostream>",
        "",
        "int main() {",
        '    std::cout << "Hello, World!" << std::endl;',
        "    return 0;",
        "}",
    ].join("\n"),
    go: ["package main", "", 'import "fmt"', "", "func main() {", '    fmt.Println("Hello, World!")', "}"].join("\n"),
    rs: ["fn main() {", '    println!("Hello, World!");', "}"].join("\n"),
};

export default new Command({
    name: "hello",
    description: "Select a programming language",
    run: ({ reply }) =>
        reply({
            embeds: [new EmbedBuilder().setDescription("Select the programming language").setColor("Blurple")],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>({
                    components: [
                        new StringSelectMenuBuilder({
                            customId: "hello-language-select",
                            placeholder: "Select the language",
                            options: [
                                { label: "TypeScript", value: "ts" },
                                { label: "JavaScript", value: "js" },
                                { label: "Python", value: "py" },
                                { label: "Java", value: "java" },
                                { label: "C#", value: "cs" },
                                { label: "C++", value: "cpp" },
                                { label: "Go", value: "go" },
                                { label: "Rust", value: "rs" },
                                { label: "Lua", value: "lua" },
                                { label: "Ruby", value: "rb" },
                            ],
                        }),
                    ],
                }),
            ],
        }),
    components: [
        new Component({
            customId: "hello-language-select",
            type: "StringSelect",
            run: async (interaction) => {
                if (!interaction.isStringSelectMenu()) return;
                const [selected] = interaction.values;
                const snippet = selected ? HELLO_LANGUAGES[selected] : undefined;
                if (!selected || !snippet) return;
                await interaction.update({
                    embeds: [new EmbedBuilder().setColor("Green").setDescription(codeBlock(selected, snippet))],
                });
            },
        }),
    ],
});
