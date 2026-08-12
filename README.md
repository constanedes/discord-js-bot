# Discord.js Bot

A general purpose Discord bot built with TypeScript, Node.js and discord.js 14.27. It is the TypeScript rewrite of [discord-py-bot](https://github.com/constanedes/discord-py-bot) with the same functionality and modular architecture.

## Features

- Modular architecture: every module lives in `src/commands/` and exports its commands.
- Hybrid commands: every command works both as a slash command (`/ping`) and with a prefix (`!ping`).
- Cryptocurrency data from the public CoinGecko API, no API key required.
- Audio playback with `@discordjs/voice` and `play-dl` (requires FFmpeg in `PATH`).
- Moderation: `clear`, `kick` and `ban` with permission checks.
- Formatting and linting with Oxc (`oxfmt` + `oxlint`).

## Structure

Commands and events are loaded automatically: every file inside `src/commands/<module>/` exports a `Command` and the folder defines the category. Every file in `src/events/` exports an `Event`.

```
src/
├── index.ts                  # Entry point
├── config.ts                 # Settings validated with Zod from .env
├── base/
│   ├── Command.ts            # Command class (declarative options, slash+prefix getters)
│   ├── Event.ts              # Event class
│   └── Component.ts          # Component class (buttons, selects, modals)
├── client/
│   └── ExtendedClient.ts     # Autodiscovery of commands, events and components
├── events/                   # ready, interactionCreate, messageCreate, guildMemberAdd/Remove
├── utils/
│   ├── http.ts               # fetch -> JSON
│   ├── voice.ts              # Voice sessions per guild
│   └── coingecko.ts          # CoinGecko client
└── commands/
    ├── general/              # ping, help, info, flip, joke, meme, say, hello
    ├── finances/             # price, coin (CoinGecko)
    ├── moderation/           # clear, kick, ban
    ├── multimedia/           # join, leave, play, ps, rs, st, skip, yt
    └── development/          # sync, shutdown (owner only)
```

To create a new command you only need to add a file:

```ts
// src/commands/general/example.ts
import { Command } from "../../base/Command.js";

export default new Command({
    name: "example",
    description: "Example command",
    run: ({ reply }) => reply("This is an example command!"),
});
```

Components are declared alongside the command (see `src/commands/general/hello.ts`) and are registered automatically when it loads.

## Usage

Requires Node.js 22+.

```sh
pnpm install
cp .env.example .env   # set BOT_TOKEN
pnpm dev
```

`DEV_GUILD_ID` syncs commands instantly on a server during development. Without it they are registered globally.

## Commands

Every command works with `!command` or `/command`.

| Command                            | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| **General**                        |                                              |
| `/ping`                            | Shows the bot latency                        |
| `/help`                            | Shows all commands grouped by module         |
| `/info`                            | Server information                           |
| `/flip`                            | Flips a coin                                 |
| `/joke`                            | Gets a random joke                           |
| `/meme`                            | Gets a random meme                           |
| `/say <message>`                   | Makes the bot repeat a message               |
| **Finances**                       |                                              |
| `/price [crypto] [fiat] [changes]` | Crypto price (default `BTC` in `USD`)        |
| `/coin [crypto]`                   | Detailed cryptocurrency information          |
| **Moderation**                     |                                              |
| `/clear [amount]`                  | Deletes messages (default 5, max 100)        |
| `/kick <member> [reason]`          | Kicks a member                               |
| `/ban <member> [reason]`           | Bans a member                                |
| **Multimedia**                     |                                              |
| `/join`                            | Joins your voice channel                     |
| `/leave`                           | Leaves the voice channel                     |
| `/play <url>`                      | Plays audio from a URL                       |
| `/ps` `/rs` `/st`                  | Pauses / resumes / stops music               |
| `/skip`                            | Skips the current track                      |
| `/yt <query>`                      | Searches YouTube and returns the first result|
| **Development (owner only)**       |                                              |
| `/sync`                            | Syncs slash commands with Discord            |
| `/shutdown`                        | Shuts the bot down                           |

## Quality

```sh
pnpm check         # typecheck (tsc --noEmit)
pnpm lint          # oxlint
pnpm format        # oxfmt --write (4 spaces)
pnpm format:check  # verify formatting
pnpm build         # compile to dist/
```
