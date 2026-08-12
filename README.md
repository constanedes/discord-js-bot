# Discord.js Bot

Bot generalista de Discord construido con TypeScript, Node.js y discord.js 14.27. Es la reescritura en TypeScript de [discord-py-bot](https://github.com/constanedes/discord-py-bot), con la misma funcionalidad y arquitectura modular.

## Características

- Arquitectura modular: cada módulo vive en `src/commands/` y exporta sus comandos.
- Comandos híbridos: cada comando funciona como slash command (`/ping`) y con prefijo (`!ping`).
- Datos de criptomonedas desde la API pública de CoinGecko, sin API key.
- Reproducción de audio con `@discordjs/voice` y `play-dl` (requiere FFmpeg en el `PATH`).
- Moderación: `clear`, `kick` y `ban` con verificación de permisos.
- Formato y linting con Oxc (`oxfmt` + `oxlint`).

## Estructura

Los comandos y eventos se cargan automáticamente: cada archivo dentro de `src/commands/<módulo>/` exporta un `Command` y la carpeta define la categoría. Cada archivo en `src/events/` exporta un `Event`.

```
src/
├── index.ts                  # Entry point
├── config.ts                 # Configuración validada con Zod desde .env
├── base/
│   ├── Command.ts            # Clase Command (opciones declarativas, getters slash+prefijo)
│   ├── Event.ts              # Clase Event
│   └── Component.ts          # Clase Component (buttons, selects, modals)
├── client/
│   └── ExtendedClient.ts     # Autodiscovery de comandos, eventos y componentes
├── events/                   # ready, interactionCreate, messageCreate, guildMemberAdd/Remove
├── utils/
│   ├── http.ts               # fetch -> JSON
│   ├── voice.ts              # Sesiones de voz por guild
│   └── coingecko.ts          # Cliente CoinGecko
└── commands/
    ├── general/              # ping, help, info, flip, joke, meme, say, hello
    ├── finances/             # price, coin (CoinGecko)
    ├── moderation/           # clear, kick, ban
    ├── multimedia/           # join, leave, play, ps, rs, st, skip, yt
    └── development/          # sync, shutdown (owner only)
```

Para crear un comando nuevo basta con agregar un archivo:

```ts
// src/commands/general/example.ts
import { Command } from "../../base/Command.js";

export default new Command({
    name: "example",
    description: "Example command",
    run: ({ reply }) => reply("This is an example command!"),
});
```

Los componentes se declaran junto al comando (ver `src/commands/general/hello.ts`) y se registran solos al cargar.

## Uso

Requiere Node.js 22+.

```sh
pnpm install
cp .env.example .env   # configurar BOT_TOKEN
pnpm dev
```

`DEV_GUILD_ID` sincroniza los comandos instantáneamente en un servidor durante desarrollo. Sin esa variable se registran globalmente.

## Comandos

Cada comando funciona con `!comando` o `/comando`.

| Comando                            | Descripción                                     |
| ---------------------------------- | ----------------------------------------------- |
| **General**                        |                                                 |
| `/ping`                            | Latencia del bot                                |
| `/help`                            | Muestra todos los comandos agrupados por módulo |
| `/info`                            | Información del servidor                        |
| `/flip`                            | Lanza una moneda                                |
| `/joke`                            | Chiste aleatorio                                |
| `/meme`                            | Meme aleatorio                                  |
| `/say <mensaje>`                   | Hace que el bot repita un mensaje               |
| **Finanzas**                       |                                                 |
| `/price [crypto] [fiat] [changes]` | Precio de una cripto (default `BTC` en `USD`)   |
| `/coin [crypto]`                   | Información detallada de una criptomoneda       |
| **Moderación**                     |                                                 |
| `/clear [cantidad]`                | Borra mensajes (default 5, máx 100)             |
| `/kick <miembro> [razón]`          | Expulsa a un miembro                            |
| `/ban <miembro> [razón]`           | Banea a un miembro                              |
| **Multimedia**                     |                                                 |
| `/join`                            | Se une a tu canal de voz                        |
| `/leave`                           | Sale del canal de voz                           |
| `/play <url>`                      | Reproduce audio desde una URL                   |
| `/ps` `/rs` `/st`                  | Pausa / reanuda / detiene la música             |
| `/skip`                            | Salta la pista actual                           |
| `/yt <búsqueda>`                   | Busca en YouTube y devuelve el primer resultado |
| **Desarrollo (owner only)**        |                                                 |
| `/sync`                            | Sincroniza los slash commands con Discord       |
| `/shutdown`                        | Apaga el bot                                    |

## Calidad

```sh
pnpm check         # typecheck (tsc --noEmit)
pnpm lint          # oxlint
pnpm format        # oxfmt --write (4 espacios)
pnpm format:check  # verificar formato
pnpm build         # compilar a dist/
```
