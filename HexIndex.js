// HexIndex.js
// version 1.0
// main bot index code/function
/*
    * The bot runs off this index file! Without it the bot won't operate. DO NOT DELETE!
 */

// (!) REQUIRED EXTERNAL LIBRARIES (!)
const Discord = require('discord.js');
const fs = require('fs'); // fs
const chalk = require('chalk');
const SQLite = require("better-sqlite3");

// (!) REQUIRED INTERNAL LIBRARIES (!)
const client = new Discord.Client();
client.commands = new Discord.Collection();

// (!) REQUIRED INTERNAL FILES (!)
const Indexer = require(`./Handlers/Indexer`);
const DatabaseHandle = require(`./Handlers/DatabaseHandle`);
const MemberHandle = require(`./Handlers/MemberHandle`);
const config = require(`./config.json`);

// bot events/functions
client.on('ready', () => {
    DatabaseHandle.setupDataBase(client);
    Indexer.setClientCommands(client);
    Indexer.setPluginCommands(client);
})

client.on('message', async message => {
    // (!) CLIENT EVENT (!) => Manages messages sent
    if (!message.content.startsWith(config["default-prefix"]) || message.author.bot) return;
    const currentChannel = message.channel.id; // get the current channels id
    const args = message.content.slice(config["default-prefix"].length).trim().split(" "); // get the arguments
    const commandName = args.shift().toLowerCase(); // transform the command to lowercase
    const command = client.commands.get(commandName); // grab the current command from (commandName)

    if (!command) return; // command doesn't exist
    if (command.usage && !args.length) {
        const requiredArgs = await command.usage.split(" ").length; // get the required arguments count
        return message.channel.send(`Missing arguments! Command (\`${command.name}\`) requires ${requiredArgs} (\`${command.usage}\`) passed (\`${args.length}\`)`).then(msg => {
            msg.delete({timeout: 15000});
        });
    }

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.log(chalk.red('[ERROR]'), `An error occured while executing the command (${command.name}) - ${error}`, error);
        return message.channel.send(`:warning: Error while processing that request. Try again later!`).then(msg => {
            msg.delete({timeout: 30000});
        });
    }
})

client.login(config.TOKEN); // bot login token

// CLIENT ERROR/LOG HANDLES
client.on('debug', m => console.log(chalk.green(`[DEBUG] [${typeof m}]`), `LOGGING DEBUG - ${m}`));
client.on('warn', m => console.log(chalk.yellow(`[WARNING] [${typeof m}]`), `Stay ALERT to - ${m}`));
client.on('error', m => console.log(chalk.red(`[ERROR] [${typeof m}]`), `An error occured - ${m}`));