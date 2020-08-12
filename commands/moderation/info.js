// info command
// only available to moderators
const Discord = require('discord.js');
const logHandler = require("../../handlers/LogHandler");
const crteEmbed = new Discord.MessageEmbed(); // create a new embed message

//TODO - Re-create the command.
//TODO - More tests and refurbishes.

// functions
function getNormalInformation(message, memberID) {
    // act: get a normal users information, has no infraction history
    crteEmbed
        .setAuthor(`${memberID.user.tag}`, memberID.user.avatarURL())
        .setColor("#65e0bd")
        .setThumbnail(memberID.user.avatarURL())
        .setDescription(`**❯ User Information**
                ID: ${memberID.user.id}
                Profile: <@${memberID.user.id}>
                Status: ${memberID.user.presence.status}
                Created: ${memberID.user.createdAt.toDateString()}`)
        .setFooter(`User Information ❯ ${memberID.user.tag}`, memberID.user.avatarURL())
        .setTimestamp(message.createdAt)
}

function getInfractionHistory(message, memberID, userinfractions) {
    // act: gets a users infraction history
    crteEmbed
        .setAuthor(`${memberID.user.tag}`, memberID.user.avatarURL())
        .setColor("#ef435d")
        .setThumbnail(memberID.user.avatarURL())
        .setDescription(`**❯ User Information**
                ID: ${memberID.user.id}
                Profile: <@${memberID.user.id}>
                Status: ${memberID.user.presence.status}
                Created: ${memberID.user.createdAt}
                **❯ User Infractions**
                Total Infractions: ${userinfractions.infractions}`)
        .setFooter(`User Information ❯ ${memberID.user.tag}`, memberID.user.avatarURL())
        .setTimestamp(message.createdAt)
}

function getBotInformation(message, memberID) {
    // act: send bot information
    crteEmbed
        .setAuthor(`${memberID.user.tag}`, memberID.user.avatarURL())
        .setColor("#e3955a")
        .setThumbnail(memberID.user.avatarURL())
        .setDescription(`**❯ Bot Information**
                ID: ${memberID.user.id}
                Profile: <@${memberID.user.id}>`)
        .setFooter(`Bot Information ❯ ${memberID.user.tag}`, memberID.user.avatarURL())
        .setTimestamp(message.createdAt)
}

// main source
module.exports = {
    name: "info",
    category: "moderation",
    usage: "{userid}",
    description: "View a users infractions",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // info command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache
        const memberID = message.guild.members.cache.get(args[0]) || message.mentions.members.first(); // members id

        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');

        // brings up information for a user
        if (!args.length) return; // no arguments were provided, reject request*
        if (!memberID) return message.channel.send(`:no_entry_sign: cannot connect \`${args[0]}\` with \`user_id\``);
        if (!allowedRles) return; // no permissions for the user, reject request*

        // get user infractions / user information / bot information / etc
        let userinfs = client.getInfrs.get(memberID.user.id); // get the users infractions and check if they have any

        if (!userinfs && !memberID.user.bot) {
            // send a normal user information
            getNormalInformation(message, memberID);
        } else if (userinfs) {
            // send a brief overview of the users infractions and information
            getInfractionHistory(message, memberID, userinfs);
        } else if (memberID.user.bot) {
            // send a brief overview of a bots information
            getBotInformation(message, memberID);
        }
        // send an embedded message
        logHandler.logFeedback(message);
        return message.channel.send(crteEmbed); // send an embedded message
    }
}