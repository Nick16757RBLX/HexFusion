// infractions command
// only available to moderators
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./internals/DATA/infractions.sqlite');

//TODO - Re-create the command.
//TODO - More tests and refurbishes.

// main source
module.exports = {
    name: "search",
    category: "moderation",
    usage: "{userid}",
    description: "View a users infractions",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // infraction command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache

        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');

        // brings up infraction info for a user
        if (!args.length) return;
        if (!allowedRles) return; // no permissions for the user, reject request*

        // get user infractions / user information / bot information / etc
        function subCommandSearch() {
            // search command, gets all infraction history from the user
            // create table index, index every case from 0-1
            const memberID = message.guild.members.cache.get(args[0]) || message.mentions.members.first(); // members id
            const userCases = sql1.prepare("SELECT * FROM infractions WHERE id = ? ORDER BY casenum DESC LIMIT 5;").all(`${memberID.user.id}-${message.channel.guild.id}`);

            let userinfs = client.getInfrs.get(memberID.user.id); // get the users infractions and check if they have any

            // perform: checks to see whether something exists
            if (!memberID) return message.channel.send(`:no_entry_sign: cannot connect \`${args[0]}\` with \`user_id\``);
            if (!userinfs) return message.channel.send(`Couldn't find any infractions.`);

            // perform: create an embed message

            let crteEmbed1 = new Discord.MessageEmbed(); // create a new embed message
            for (const data of userCases) {
                // create an index, check if the warning is a mute or not
                if (data.type === 'Mute') {
                    // create a seperate infraction for a warning
                    crteEmbed1
                        .setColor("#e3831d")
                        .addField(`Case ${data.casenum}`, `ID: ${data.casenum} | Created: ${data.timestamp} | Type: ${data.type} | User: <@${memberID.user.id}> | Muted for: ${data.time} | Mod: <@${data.modID}> | Reason: ${data.reason} |`)
                } else {
                    // create a seperate infraction for a regular warn
                    crteEmbed1
                        .setColor("#e3831d")
                        .addField(`Case ${data.casenum}`, `ID: ${data.casenum} | Created: ${data.timestamp} | Type: ${data.type} | User: <@${memberID.user.id}> | Mod: <@${data.modID}> | Reason: ${data.reason} |`)
                }

            }
            // send a message response back
            crteEmbed1.setAuthor(`Infractions for - ${memberID.user.tag}`, memberID.user.avatarURL({dynamic: true, size: 512}))
            return message.channel.send(crteEmbed1);
        }

        // perform the search command
        subCommandSearch();

    }
}