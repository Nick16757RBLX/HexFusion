// kick command
// only available to moderators
const Discord = require('discord.js');

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

        // set user infraction
        let infractions;
        let cases;
        let userinfs;

        function setCases() {
            // sets the amount of cases
            cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists

            if (!cases) {
                // create cases
                cases = {
                    id: `${message.guild.id}`,
                    cases: 0,
                }
            }
            cases.cases++;
        }

        function setNewInfraction() {
            // places a new infraction on a user
            infractions = client.getInfs.get(`${memberID.user.id}-${message.channel.guild.id}`);

            infractions = {
                id: `${memberID.user.id}-${message.channel.guild.id}`,
                user: memberID.user.username,
                userID: memberID.user.id,
                reason: rreason,
                casenum: cases.cases,
                mod: message.author.username,
                modID: message.author.id,
                type: 'Kick',
                time: '',
                timestamp: message.createdAt.toDateString(),
            }
        }

        function setUserInfs() {
            // sets the users infractions
            userinfs = client.getInfrs.get(memberID.user.id); // get the users infractions and check if they have any

            if (!userinfs) {
                // create user infractions
                userinfs = {
                    id: memberID.user.id,
                    infractions: 0,
                }
            }
            userinfs.infractions++; // increase the infraction count
        }

        // finish processing the command
        setCases();
        setNewInfraction();
        setUserInfs();
        sendFeedback(message, rreason, memberID);

        client.setDta.run(cases);
        client.setInfrs.run(userinfs);
        client.setInfs.run(infractions);

        try {
            // kick the member
            memberID.kick();
        } catch (e) {
            console.log(e);
        }

        return message.channel.send(`:ok_hand: kicked ${memberID.user.tag} \`(${rreason})\``);
    }
}