import client from "./client/index.js";
import { ENV } from "./consts.js";

function main() {
    client.login(ENV.DISCORD_TOKEN);
    console.log("Running...");
}

try {
    main();
} catch (error) {
    console.log(error);
}
