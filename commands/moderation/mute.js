// mute command
// only available to moderators
const logHandler = require('../../handlers/LogHandler');
const InfHandle = require('../../handlers/InfHandle');
const ms = require('ms');

//TODO - Re-create the command.
//TODO - More tests and refurbishes.

// main source
module.exports = {
    name: "mute",
    category: "moderation",
    usage: "{userid} {duration} {reason}",
    description: "Mutes a user for a defined time",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // mute command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache
        const memberID = message.guild.members.cache.get(args[0]) || message.mentions.members.first(); // members id

        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');
        let rreason = args.slice(2).join(" "); // split the reason between args 1-2
        let tempdata = []; // table to hold temporary data

        // mute a user + log the mute
        if (!args.length) return; // no arguments were provided, reject request*
        if (!memberID) return message.channel.send(`:no_entry_sign: cannot connect \`${args[0]}\` with \`user_id\``);if (!allowedRles) return; // no permissions for the user, reject request*
        if (memberID.user.bot) return message.channel.send(`:no_entry_sign: you cannot mute bots`); // you cannot warn bots
        if (message.author.id === memberID.user.id) return message.channel.send(`:no_entry_sign: you cannot mute yourself`); // is author, can't warn
        if (!rreason) return; // no reason was given + required, reject request*
        if (message.member.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret') && memberID.roles.cache.some(r => r.name === 'lead')) return;
        if (message.member.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret') && memberID.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret')) return;
        if (message.member.roles.cache.some(r => r.name === 'lead') && memberID.roles.cache.some(r => r.name === 'lead')) return;

        async function setNewInfraction() {
            // places a new infraction on a user
            InfHandle.SetCases(client, message);
            InfHandle.addNewInfraction(client, message, memberID, rreason, "mute", args[1]);

            // end infraction creation, set time for the user
            let muteTime = args[1];
            let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

            if (!muteTime) {
                muteTime = 1000000
            } // mute indefinitely

            // add the mute role to the user
            if (memberID.roles.cache.has(r => r.name === 'Muted')) return message.channel.send(`:no_entry_sign: ${memberID.user.tag} is already muted`);

            await (memberID.roles.add(muteRole));
            console.log(`${memberID.user.tag} was muted for ${ms(muteTime)}`);

            // mute the user for given time
            setTimeout(function() {
                // set the users timeout time
                memberID.roles.remove(muteRole);
            }, ms(muteTime));

        }


        // finish processing the command
        await setNewInfraction();
        logHandler.logPunishment(message);

        return message.channel.send(`:ok_hand: muted ${memberID.user.tag} for (\`${rreason}\`)`);
    }
}