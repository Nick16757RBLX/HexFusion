// hexindex.js
// version 1.0
// manages all bot commands/functions
const fs = require('fs');
const Discord = require('discord.js');
const dbSetup = require(`./handlers/dbSetup`);
const { prefix, token, allowedchannels } = require('./internals/configuration.json') // configuration file for the bot
const client = new Discord.Client();

client.commands = new Discord.Collection();

dbSetup.setupDatabase();
dbSetup.setClientCommands(client);

["command"].forEach(handler => {
    require(`./handlers/command`)(client);
});

// bot events/functions
client.on('ready', () => {
    console.log(`I\'m online now. Any bugs/errors will be reported here!`);
})

client.on('message', async message => {
    // main executor
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // const variables
    const currentChannel = message.channel.id; // get the current channels id
    const args = message.content.slice(prefix.length).trim().split(" ");
    const commandName = args.shift().toLowerCase(); // make the command lowercase
    const command = client.commands.get(commandName); // gets the current command specified by the args
    const commChannel = message.member.guild.channels.cache.find(ch => ch.id === allowedchannels[0] || ch.id === allowedchannels[1] || ch.id === allowedchannels[2]); // get the moderation channel
    const argsCount = await command.usage.split(" ").length; // get the required arguments count

    // internal functions
    function sendFeedback() {
        // act: send an error message to the command-use-logs
        const emoji = message.guild.emojis.cache.find(em => em.name === 'tickno');
        const channel = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
        if (!channel) return;

        message.channel.send(`${emoji} An error occured with the command ${command.name}. Try again later!`);
        return channel.send(`:exclamation: an **error** occured with the command **${command.name}**`);
    }

    function checkChannelRestrictions() {
        // get all channels and check if the channel is available for text
        if (currentChannel !== commChannel.id) return message.delete();
    }

    // check if the command exists
    if (!command) return;
    if (command.argsreq && !args.length && currentChannel === commChannel.id || args.length < command.usage.split(" ").length && command.argsreq && currentChannel === commChannel.id) {
        return message.channel.send(`Command \`${command.name}\` requires \`${argsCount}\` arguments (\`${command.usage}\`) passed \`${args.length}\``);
    }
    if (command.guildOnly && message.channel.type !== 'text') return; // prevent commands inside DMs

    checkChannelRestrictions(); // check channel restrictions

    // run the command sent

    try {
        const exeCom = await command
        exeCom.execute(message, args, client); // run the command
    } catch (error) {
        // log the error to the console
        console.log(`An error occured while processing the command ${command.name}`);
        console.log(error);
        sendFeedback();
    }
})

/*client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // variables
    const currentChannel = message.channel.id; // get the current channels id
    const args = message.content.slice(prefix.length).trim().split(" "); // split by spaces
    const commandName = args.shift().toLowerCase(); // lower case
    const command = client.commands.get(commandName); // gets the current command specified by the args
    const commChannel = message.member.guild.channels.cache.find(ch => ch.id === '726602878764187797' || ch.id === '721944921644335135' || ch.id === '721914589398171699'); // get the moderation channel

    // functions
    function sendFeedback() {
        // act: send an error message to the command-use-logs
        const emoji = message.guild.emojis.cache.find(em => em.name === 'tickno');
        const channel = message.guild.channels.cache.find(ch => ch.name === 'command-use-logs');
        if (!channel) return;

        message.channel.send(`${emoji} An error occured with the command ${command.name}. Try again later!`);
        return channel.send(`:exclamation: an **error** occured with the command **${command.name}**`);
    }

    function checkChannelRestrictions() {
        // get all channels and check if the channel is available for text
        if (currentChannel !== commChannel.id) return message.delete();
    }

    // check if a command exists
    if (!command) return;
    const argsCount = command.usage.split(" ").length
    if (command.argsreq && !args.length && currentChannel === commChannel.id || args.length < command.usage.split(" ").length && command.argsreq && currentChannel === commChannel.id) {
        return message.channel.send(`Command \`${command.name}\` requires \`${argsCount}\` arguments (\`${command.usage}\`) passed \`${args.length}\``);
    }

    if (command.guildOnly && message.channel.type !== 'text') return message.reply('I can\'t execute that command inside DMs!');

    checkChannelRestrictions(); // check restrictions

    try {
        command.execute(message, args, client); // fire command
    } catch (e) {
        // act: send an error message to the command-use-logs
        console.log(e);
        sendFeedback();
    }
})*/

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

client.login(token); // bot login token