import { config } from "dotenv";
import { resolve } from "node:path";
import { envVariables } from "./consts.js";


const ENV_FILE = ".env";
config({ path: resolve(process.cwd(), ENV_FILE) });

console.log(process.env.DISCORD_TOKEN);
