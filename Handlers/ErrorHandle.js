// ErrorHandle.js
/*
    * This handler handles all error processes and warnings that are received from commands.
 */
const chalk = require('chalk');

var METHODS = {}

METHODS.INVALIDPERMISSIONS = function (message, data, delayDelete) {
    /*
        * This method is for handling invalid permission errors
     */
    if (!delayDelete) return message.channel.send(`:no_entry_sign: You don't have access to that command!`);
    METHODS.LOGGER(chalk.red(`[INVALID_PERMS]`)+` USER ${message.author.tag} (${message.author.id}) HAS NO PERMISSIONS FOR ${data.toUpperCase()}`);
    return message.channel.send(`:no_entry_sign: You don't have access to that command!`).then(msg => msg.delete({timeout: 10000}));
}

METHODS.LOGGER = function (insert) {
    console.log(insert);
}

module.exports = METHODS;