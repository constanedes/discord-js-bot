import { z } from 'zod'
import { IConfiguration } from './IConfiguration.js'

const envSchema = z.object({
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]).optional(),
    DISCORD_TOKEN: z.string(),
})

export const envVariables: IConfiguration = envSchema.parse(process.env)

declare global {
    namespace NodeJS {
        // rome-ignore lint/suspicious/noEmptyInterface: <explanation>
        interface  ProcessEnv extends z.infer<typeof envSchema> {}
    }
}

