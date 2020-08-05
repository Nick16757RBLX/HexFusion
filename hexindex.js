// hexindex.js
// version 1.0
// manages all bot commands/functions
const fs = require('fs');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./DATA/infractions.sqlite');
const sql2 = new SQLite('./DATA/datavals.sqlite');
const sql3 = new SQLite('./DATA/userdta.sqlite');
const { prefix, token } = require('./internals/configuration.json') // configuration file for the bot

const client = new Discord.Client();
client.commands = new Discord.Collection();

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// bot events/functions
client.on('ready', () => {
    console.log(`I\'m online now. Any bugs/errors will be reported here!`);
    function setupSQLData() {
        // create data tables
        const infractiondata = sql1.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'infractions';").get();
        const datavalues = sql2.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'datavalues';").get();
        const userdata = sql3.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userdta';").get();

        // create datas
        if (!infractiondata['count(*)']) {
            // create infractions data
            sql1.prepare("CREATE TABLE infractions (id TEXT, user TEXT, userID TEXT, reason TEXT, casenum INTEGER PRIMARY KEY, mod TEXT, modID TEXT, type TEXT, time TEXT, timestamp TEXT);").run();
            // create a new insert that is unique, ensure it is unique or it won't work
            sql1.prepare("CREATE UNIQUE INDEX idx_infractions_casenum ON infractions (casenum);").run();
        }
        if (!datavalues['count(*)']) {
            // create infractions data
            sql2.prepare("CREATE TABLE datavalues (id TEXT PRIMARY KEY, cases INTEGER);").run();
            // create a new insert that is unique, ensure it is unique or it won't work
            sql2.prepare("CREATE UNIQUE INDEX idx_datavalues_id ON datavalues (id);").run();
        }
        if (!userdata['count(*)']) {
            // create infractions data
            sql3.prepare("CREATE TABLE userdta (id TEXT PRIMARY KEY, infractions INTEGER);").run();
            // create a new insert that is unique, ensure it is unique or it won't work
            sql3.prepare("CREATE UNIQUE INDEX idx_userdta_id ON userdta (id);").run();
        }

    }

    function setClientCommands() {
        // act: setup the client commands for sql data or externals
        client.getInfs = sql1.prepare("SELECT * FROM infractions WHERE id = ?");
        client.setInfs = sql1.prepare("INSERT INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
        client.updInfs = sql1.prepare("REPLACE INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
        client.getDta = sql2.prepare("SELECT * FROM datavalues WHERE id = ?");
        client.setDta = sql2.prepare("INSERT OR REPLACE INTO datavalues (id, cases) VALUES (@id, @cases);");
        client.getInfrs = sql3.prepare("SELECT * FROM userdta WHERE id = ?");
        client.setInfrs = sql3.prepare("INSERT OR REPLACE INTO userdta (id, infractions) VALUES (@id, @infractions);");
    }

    setupSQLData(); // act: setup the sql data for the server
    setClientCommands(); // act: set the client commands

})

client.on('message', message => {
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

    checkChannelRestrictions();

    try {
        command.execute(message, args, client); // fire command
    } catch (e) {
        // act: send an error message to the command-use-logs
        console.log(e);
        sendFeedback();
    }
})

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