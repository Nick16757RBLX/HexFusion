// LogHandler.js
// handles and logs every actions on the server
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('../internals/configuration.json') // configuration file for the bot

// bot events/functions

var bannedWords = [
    "nigga",
    "faggot",
    "porn",
    "xxx",
    "pornhub",
    "stupido",
]

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

methods.logPunishment = function (message) {
    // act: send a feedback message to the command-use-logs
    const commandusechnn = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
    if (!commandusechnn) return;

    // send feedback messages to the logs
    commandusechnn.send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) used command in **${message.channel}** (\`${message.channel.id}\`): \`${message.content}\``);
}

methods.logCensored = function (message, blacklisted) {
    // send a filtered message text to #censored-messages
    // act: send a feedback message to the censored-messages
    const censoredchnn = message.guild.channels.cache.find(ch => ch.name === 'censored-messages');
    if (!censoredchnn) return;

    return censoredchnn.send(`:no_entry_sign: censored message from ${message.author.tag} (\`${message.author.id}\`) in #${message.channel.name} with blacklisted item: ${blacklisted}\n\```${message}\````)
}

methods.getFiltered = async function (message) {
    // check to see if the message contains a filtered message
    let msg = message.content.toLowerCase();
    let bypassChannels = message.guild.channels.cache.find(ch => ch.id === '739606541237223596' || ch.id === '726602878764187797' || ch.id === '721914589398171699' || ch.id === '721944921644335135');
    let blacklisted = [];
    let msgtemp;

    for (x = 0; x < bannedWords.length; x++) {
        //if (message.member.roles.cache.some(role => role.name === "lead" || message.member.hasPermission("ADMINISTRATOR"))) return;
        console.log("pass1");
        msgtemp = msg.includes(bannedWords[x]);
        if (msg.includes(bannedWords[x]) || message.channel.id !== bypassChannels.id) {
            console.log("pass2");
            methods.logCensored(message, blacklisted);
            blacklisted.push(msgtemp)
            await message.delete();
        }
    }
}

module.exports = methods;

// create embed infraction

