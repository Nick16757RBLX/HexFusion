// kick command
// only available to moderators
const Discord = require('discord.js');
const logHandler = require('../../handlers/LogHandler');
const InfHandle = require('../../handlers/InfHandle');

//TODO - Re-create the command.
//TODO - More tests and refurbishes.

module.exports = {
    name: "kick",
    category: "moderation",
    usage: "{userid} {reason}",
    description: "Kick a user",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // kick command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache
        const memberID = message.guild.members.cache.get(args[0]) || message.mentions.members.first(); // members id

        let allowedRles = rolesCache.some(role => role.name === 'lead');
        let rreason = args.slice(1).join(" "); // split the reason between args 1-2

        // check if the client sent all requirements
        if (!args.length) return; // no arguments were provided, reject request*
        if (!memberID) return message.channel.send(`:no_entry_sign: cannot connect \`${args[0]}\` with \`user_id\``);
        if (memberID.user.bot) return message.channel.send(`:no_entry_sign: you cannot kick bots`); // you cannot warn bots
        if (message.author.id === memberID.user.id) return message.channel.send(`:no_entry_sign: you cannot kick yourself`); // is author, can't warn
        if (!allowedRles) return; // no permissions for the user, reject request*
        if (message.member.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret') && memberID.roles.cache.some(r => r.name === 'lead')) return;
        if (message.member.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret') && memberID.roles.cache.some(r => r.name === 'Chat Moderator' || r.name === 'Secret')) return;
        if (message.member.roles.cache.some(r => r.name === 'lead') && memberID.roles.cache.some(r => r.name === 'lead')) return;

        // add an infraction
        InfHandle.SetCases(client, message);
        InfHandle.addNewInfraction(client, message, memberID, rreason, "kick", "");
        logHandler.logPunishment(message, rreason, memberID, "kicked");

        try {
            // kick the member
            memberID.kick();
        } catch (e) {
            return console.log(e);
        }

        return message.channel.send(`:ok_hand: kicked ${memberID.user.tag} \`(${rreason})\``);
    }
}