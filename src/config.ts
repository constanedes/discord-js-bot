import "dotenv/config";
import { z } from "zod";

/** Optional Discord snowflake; empty strings in .env count as unset. */
const snowflake = z.preprocess((value) => (value === "" ? undefined : value), z.string().regex(/^\d+$/).optional());

const schema = z.object({
    BOT_TOKEN: z.string().min(1),
    COMMAND_PREFIX: z.string().min(1).max(3).default("!"),
    DESCRIPTION: z.string().default("A general purpose Discord bot"),
    OWNER_ID: snowflake,
    WELCOME_CHANNEL_ID: snowflake,
    DEV_GUILD_ID: snowflake,
});

const result = schema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
    process.exit(1);
}

export const config = {
    token: result.data.BOT_TOKEN,
    prefix: result.data.COMMAND_PREFIX,
    description: result.data.DESCRIPTION,
    ownerId: result.data.OWNER_ID,
    welcomeChannelId: result.data.WELCOME_CHANNEL_ID,
    devGuildId: result.data.DEV_GUILD_ID,
} as const;
