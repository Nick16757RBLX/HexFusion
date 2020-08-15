// InfHandler.js
// Handles the creation of infraction data
const Discord = require('discord.js');

var InfHandler = {}

InfHandler.addNewInfraction = function (client, message, memberID, reason, type, time) {
    // add a new infraction to the user: memberID
    let infractions;
    let userinfs;

    infractions = client.getInfs.get(`${memberID.user.id}-${message.channel.guild.id}`);
    cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists

    // internal functions

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

    function setInfractions() {
        // add an infraction
        infractions = {
            id: `${memberID.user.id}-${message.channel.guild.id}`,
            user: memberID.user.username,
            userID: memberID.user.id,
            reason: reason,
            casenum: cases.cases,
            mod: message.author.username,
            modID: message.author.id,
            type: type,
            time: time,
            timestamp: message.createdAt.toDateString(),
        }
    }

    // perform the functions

    setInfractions();
    setUserInfs();

    // set and async the results
    createInfractionLog(client, message, memberID, reason, type, time);
    client.setInfrs.run(userinfs);
    client.setInfs.run(infractions);

}

InfHandler.SetCases = function (client, message) {
    // add to the case count
    cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists

    if (!cases) {
        // create cases
        cases = {
            id: `${message.guild.id}`,
            cases: 0,
        }
    }
    cases.cases++;

    client.setDta.run(cases);
}

module.exports = InfHandler;

function createInfractionLog(client, message, memberID, reason, type, time) {
    // create an embedded message of the infraction
    const cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists
    const punishmentchnn = message.guild.channels.cache.find(ch => ch.name === 'punishment-logs');
    const infracEmbed = new Discord.MessageEmbed()

    if (type === 'mute') {
        // user was muted
        infracEmbed.addFields(
            { name: `User ID`, value: `${memberID.user.id}`, inline: true },
            { name: `User Tag`, value: `${memberID.user.tag}`, inline: true },
            { name: `Reason`, value: `${reason}`, inline: true },
            { name: `Moderator`, value: `${message.author.tag}`, inline: true },
            { name: `Moderator ID`, value: `${message.author.id}`, inline: true },
            { name: `Duration`, value: `${time}`, inline: true },
        )
    } else {
        // user was muted/kicked/banned/warned
        infracEmbed.addFields(
            { name: `User ID`, value: `${memberID.user.id}`, inline: true },
            { name: `User Tag`, value: `${memberID.user.tag}`, inline: true },
            { name: `Reason`, value: `${reason}`, inline: true },
            { name: `Moderator`, value: `${message.author.tag}`, inline: true },
            { name: `Moderator ID`, value: `${message.author.id}`, inline: true }
        )
    }
    // create extra embed methods
    infracEmbed.setThumbnail(memberID.user.avatarURL()); // set the thumbnail to user avatar
    infracEmbed.setFooter(`Case number ${cases.cases}`); // set the footer to the current case number
    infracEmbed.setTimestamp(); // set the timestamp when the message was created

    // set the title
    if (type === 'mute') infracEmbed.setTitle(`:zipper_mouth: ${memberID.user.tag} received a ${type}!`);
    if (type === 'warn') infracEmbed.setTitle(`:warning: ${memberID.user.tag} received a ${type}!`);
    if (type === 'kick') infracEmbed.setTitle(`:boot: ${memberID.user.tag} received a ${type}!`);
    if (type === 'ban') infracEmbed.setTitle(`:rotating_light: ${memberID.user.tag} received a ${type}!`);

    punishmentchnn.send(infracEmbed);
}