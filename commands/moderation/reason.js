// reason command
// only available to moderators
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./internals/DATA/infractions.sqlite');
const logHandler = require("../../handlers/logHandler");


//TODO - Re-create the command.
//TODO - More tests and refurbishes.

// main source
module.exports = {
    name: "reason",
    category: "moderation",
    usage: "{casenum} {reason}",
    description: "Update an infractions reason",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // reason command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache

        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');
        let infraction;

        // brings up infraction info for a user
        if (!args.length) return;
        if (!allowedRles) return; // no permissions for the user, reject request*

        // get user infractions / user information / bot information / etc
        function subCommandSearch() {
            // search command, gets all infraction history from the user
            // create table index, index every case from 0-1
            const userCases = sql1.prepare("SELECT * FROM infractions WHERE casenum = ? ORDER BY casenum DESC LIMIT 1000;").all(args[0]);

            // perform: checks to see whether something exists

            // perform: set the new data
            for (const data of userCases) {
                infraction = {
                    id: data.id,
                    user: data.user,
                    userID: data.userID,
                    reason: args[1],
                    casenum: args[0],
                    mod: data.mod,
                    modID: data.modID,
                    type: data.type,
                    time: data.time,
                    timestamp: data.timestamp
                }
            }

            client.updInfs.run(infraction);
            return message.channel.send(`:ballot_box_with_check: Updated the reason for case #${args[0]}`);
        }

        // finish command process
        logHandler.logFeedback(message);
        subCommandSearch();

    }
}