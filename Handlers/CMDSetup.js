// CMDSetup.js
// version 2.0

// (!) ALTERNATE INTERNAL/EXTERNAL LIBRARIES
const { readdirSync } = require('fs');
const ascii = require("ascii-table");
const chalk = require("chalk");

// (!) VARIABLES
let table = new ascii("Commands");
table.setHeading("Command", "Load Status");

module.exports = (client) => {
    readdirSync(`./Commands/`).forEach(dir => {
        // begin searching & filtering commands
        const Commands = readdirSync(`./Commands/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of Commands) {
            let pullFile = require(`../Commands/${dir}/${file}`);

            if (pullFile.name) {
                // add command to cycle
                client.commands.set(pullFile.name, pullFile);
                table.addRow(file, 'Ready ✅');
            } else {
                table.addRow(file, 'Error > The file is missing someone critical for processing!');
                continue;
            }

            if (pullFile.aliases && Array.isArray(pullFile.aliases)) pullFile.aliases.forEach(alias => client.aliases.set(alias, pullFile.name));
            // finish
        }
    })
}

console.log(chalk.green(`[SETUP] [FINISHED]`), table.toString());