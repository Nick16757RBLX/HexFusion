// Indexer.js
// Handler used to Indexer databases
const Discord = require('discord.js');
const fs = require('fs'); // fs
const client = new Discord.Client();

client.commands = new Discord.Collection();

var Indexer = {};

Indexer.setClientCommands = function (client) {
    // get a command path and set the Commands
    fs.readdirSync(`./Commands/`).forEach(dir => {
        const Commands = fs.readdirSync(`./Commands/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of Commands) {
            let pullFile = require(`../Commands/${dir}/${file}`);

            if (pullFile.name) {
                console.log(`[CREATE] Created command: ${pullFile.name}`);
                client.commands.set(pullFile.name, pullFile);
            }
        }

    })
}

Indexer.setPluginCommands = function (client) {
    // get a command path and set the Commands
    fs.readdirSync(`./Plugins/`).forEach(dir => {
        const commands = fs.readdirSync(`./Plugins/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of commands) {
            let pullFile = require(`../Plugins/${dir}/${file}`);
            client.commands.set(pullFile.name, pullFile);
            console.log(`[CREATE] Created command: ${pullFile.name}`);
        }

    })
}

module.exports = Indexer;