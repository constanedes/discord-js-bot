import { z } from "zod";
import { IConfiguration } from "./IConfiguration.js";
import { config } from "dotenv";
import { resolve } from "path";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DISCORD_TOKEN: z.string(),
});

config({ path: resolve(process.cwd(), ".env") });

export const getEnvIssues = (): z.ZodIssue[] | void => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) return result.error.issues;
};

const issues = getEnvIssues();
if (issues) {
    console.error("Invalid environment variables, check the errors below!");
    console.error(issues);
    process.exit(-1);
}

export const ENV:IConfiguration = envSchema.parse(process.env)
console.log("The environment variables are valid!");
