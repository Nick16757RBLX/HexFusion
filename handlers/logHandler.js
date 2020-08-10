// logHandler.js
// handles and logs every actions on the server
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('../internals/configuration.json') // configuration file for the bot
const dbSetup = require(`./dbSetup`);


// bot events/functions

client.on('messageDelete', message => {
    // act: when a message is deleted, send a message to the message-logs
    const channel = message.guild.channels.cache.find(ch => ch.name === 'message-logs');
    if (!channel || message.content.startsWith(prefix) || message.author.bot) return;

    channel.send(`:wastebasket: ${message.author.tag} (\`${message.author.id}\`) message deleted in **${message.channel}** (\`${message.channel.id}\`): ${message.content}`);
})

client.on('messageUpdate', message => {
    // act: when a message is updated, send a message to the message-logs
    const channel = message.guild.channels.cache.find(ch => ch.name === 'message-logs');
    if (!channel || message.content.startsWith(prefix) || message.author.bot) return;

    channel.send(`:bookmark_tabs: ${message.author.tag} (\`${message.author.id}\`) message edited in **${message.channel}** (\`${message.channel.id}\`): ${message.content}`);
})

var methods = {}

methods.logFeedback = function (message) {
    // act: send a feedback message to the command-use-logs
    const commandusechnn = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
    if (!commandusechnn) return;

    commandusechnn.send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) used command in **${message.channel}** (\`${message.channel.id}\`): \`${message.content}\``);
}

methods.logPunishment = function (message, reason, memberID, type) {
    // act: send a feedback message to the command-use-logs
    const commandusechnn = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
    const punishmentchnn = message.guild.channels.cache.find(ch => ch.name === 'punishment-logs');
    if (!commandusechnn) return;
    if (!punishmentchnn) return;

    // send feedback messages to the logs
    punishmentchnn.send(`:boot: **${memberID.user.tag}** (\`${memberID.user.id}\`) was ${type} by **${message.author.tag}**: \`${reason}\``);
    commandusechnn.send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) used command in **${message.channel}** (\`${message.channel.id}\`): \`${message.content}\``);
}

module.exports = methods;