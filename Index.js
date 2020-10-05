// Index.js
/*
    * This bots framework depends on this main file for processing. If this file is deleted or modified in some way, there may be errors!
    * DO NOT DELETE THIS FILE :(
 */

// (!) Required internal/external libraries (modules)
require('dotenv-flow').config();
const {Collection: Collection, Client: Client} = require('discord.js'); // require collections, client
const {red: red, green: green, yellow: yellow} = require('chalk'); // error cl code

const client = new Client({
    disableMentions: "everyone",
    retryLimit: 3,
    fetchAllMembers: true
});

// (!) Command Handlers
client.commands = new Collection();
client.aliases = new Collection();

// (!) internal/external files
const { setupGlobalDatabase } = require('./Handlers/DatabaseHandler');
const { NOTENOUGHARGS } = require('./Handlers/ErrorHandler');
const { checkPermissions } = require('./functions');
const CMDSetup = require('./Handlers/CMDSetup');


// PROCESS & BOT FUNCTIONS
/* The bot is dependent on these functions! Without them the bot will not respond :( */

client.on('ready', () => {
    /*
        * This bot function runs once when the bot is completely online.
            * Setup the database if not already setup (global database)
            * Setup the commands.. bot & plugin commands
     */
    setupGlobalDatabase(client); // setup the global database (global/general)
    CMDSetup(client); // setup the user/bot commands (global/general/plugins)
})

client.on('message', async message => {
    const { channel: channel, content: content } = message; // get class/function types from message
    const args = content.slice(process.env.PREFIX.length).trim().split(" "); // get the arguments from the (command) / message
    const commandName = args.shift().toLowerCase(); // set the (arguments) to lower case
    const command = client.commands.get(commandName); // grab the command from (commandName)

    // (&) Perform syntax / command checks #1 (add member to cache) (permissions)
    if (!content.startsWith(process.env.PREFIX) || message.author.bot) return; // invalid syntax / command prefix
    if (!command) return; // invalid command (doesn't exists)

    // (&) Perform command / feedback checks #3
    if (command.usage && !args.length) return NOTENOUGHARGS(client, message, args, commandName); // not enough arguments supplied

    // ($) Finish & process the command (check permissions) #4
    checkPermissions(message, client, command.name);

    try {
        command.run(message, args, client);
    } catch (e) {
        console.log(e);
        return channel.send(`:warning: Issue while processing that command. Try again later!`).then(msg => {
            msg.delete({timeout: 20000});
        })
    }

})

client.login(process.env.TOKEN);

// DEBUGGING & ERROR PROCESSING
/* The bot is dependent on these functions for (error handling)! Without them the bot may not operate correctly :( */

client.on('debug', db => console.log(green(`[DEBUG]`), `LOGGING - ${db}`));
client.on('warn', wn => console.log(yellow(`[WARNING]`), `WATCH OUT FOR - ${wn}`));
client.on('error', err => console.log(red(`[ERROR]`), `An error occurred - ${err}`));