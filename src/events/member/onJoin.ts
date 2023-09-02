import { Event } from "../../base/Event.js";

export default new Event({
    name: "guildMemberAdd",
    run(member) {
        console.log(`New member ${member.user.username}`);
    },
});