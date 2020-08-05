// mute command
// only available to moderators
// functions
const Discord = require(`discord.js`);

function sendFeedback(message, memberID) {
    // act: send a feedback message to the command-use-logs
    const commandusechnn = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
    const punishmentchnn = message.guild.channels.cache.find(ch => ch.name === 'punishment-logs');
    const infractionschnn = message.guild.channels.cache.find(ch => ch.name === 'infraction-information');
    if (!commandusechnn) return;
    if (!punishmentchnn) return;
    if (!infractionschnn) return;

    // send feedback messages to the logs
    punishmentchnn.send(`:open_mouth: **${memberID.user.tag}** (\`${memberID.user.id}\`) was unmuted by **${message.author.tag}**`);
    commandusechnn.send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) used command in **${message.channel}** (\`${message.channel.id}\`): \`${message.content}\``);
}

// main source
module.exports = {
    name: "unmute",
    category: "moderation",
    usage: "(userid)",
    description: "Unmutes a user",
    argsreq: true,
    guildOnly: true,
    execute: function (message, args, client) {
        // unmute command source
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache
        const memberID = message.guild.members.cache.get(args[0]) || message.mentions.members.first(); // members id

        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');

        // mute a user + log the mute
        if (!args.length) return; // no arguments were provided, reject request*
        if (!memberID) return message.channel.send(`:no_entry_sign: cannot connect \`${args[0]}\` with \`user_id\``);
        if (memberID.user.bot) return message.channel.send(`:no_entry_sign: you cannot mute bots`); // you cannot warn bots
        if (message.author.id === memberID.user.id) return message.channel.send(`:no_entry_sign: you cannot mute yourself`); // is author, can't warn
        if (!allowedRles) return; // no permissions for the user, reject request*

        // remove a mute from an user

        async function removeMuteFromUser() {
            // act: remove a mute from user
            let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
            await (memberID.roles.remove(muteRole));
        }

        // send feedback message
        removeMuteFromUser(); // act: remove the users mute
        sendFeedback(message, memberID); // act: send feedback message

        return message.channel.send(`:ok_hand: ${memberID.user.tag} is now unmuted`);
    }
}