// reason command
// only available to moderators
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./DATA/infractions.sqlite');

// functions
function sendFeedback(message) {
    // act: send a feedback message to the command-use-logs
    const commandusechnn = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
    if (!commandusechnn) return;

    // send feedback messages to the logs
    commandusechnn.send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) used command in **${message.channel}** (\`${message.channel.id}\`): \`${message.content}\``);
}

// main source
module.exports = {
    name: "reason",
    category: "moderation",
    usage: "{casenum} {reason}",
    description: "Update an infractions reason",
    argsreq: true,
    guildOnly: true,
    execute: function (message, args, client) {
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
            const userCases = sql1.prepare("SELECT * FROM infractions WHERE casenum = ? ORDER BY casenum DESC LIMIT 700;").all(args[0]);

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

        sendFeedback(message);
        subCommandSearch();

    }
}