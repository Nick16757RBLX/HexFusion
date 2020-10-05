// ErrorHandler.js
/*
    * This handler handles all error processes and warnings that are received from commands.
 */

// COMMAND PROCESS
const METHODS = {}

// (!) COMMON CHECKS
METHODS.NOTENOUGHARGS = function (client, message, args, commandName) {
    /*
        * This method is for handing (NOTENOUGHARGS) errors
     */
    const { member: MemberClass, channel: channel } = message; // get class/function types from message (global)
    const command = client.commands.get(commandName); // grab the command from (commandName) (local)
    const requiredArgs = command.usage.trim().split("+").length; // get the required amount of arguments (command)

    if (!MemberClass.hasPermission('VIEW_AUDIT_LOG' || 'MANAGE_MESSAGES')) return; // Check if user has the roles. If not don't return a message
    return channel.send(`Missing arguments! Command (\`${commandName}\`) requires (\`${requiredArgs}\`) arguments (\`${command.usage}\`)`)
        .then(msg => msg.delete({timeout: 20000, reason: 'timeout expired'}))
        .catch(err => console.error(err))
}

METHODS.USERNOTFOUND = function (message, data) {
    /*
    * This method is for handling user_not_found errors
 */
    const { member: MemberClass, channel: channel } = message; // get class/function types from message

    if (!MemberClass.hasPermission('VIEW_AUDIT_LOG' || 'MANAGE_MESSAGES')) return
    return channel.send(`:no_entry_sign: Couldn\'t find user \`${data}\` from \`user_id\``)
        .catch(err => console.log(err));
}

METHODS.MOD_NOT_ENABLED = function (message) {
    /*
    * This method is for handling mod_not_enabled errors
*/
    const { member: MemberClass, channel: channel } = message; // get class/function types from message

    if (!MemberClass.hasPermission('VIEW_AUDIT_LOG' || 'MANAGE_MESSAGES')) return
    return channel.send(`:no_entry_sign: Module is not enabled! This module can be enabled by typing \`+config\`.`)
        .catch(err => console.log(err));
}

METHODS.INVALIDPERMISSIONS = function (message) {
    /*
        * This method is for handling invalid permission errors
     */
    const { member: MemberClass, channel: channel } = message; // get class/function types from message

    if (!MemberClass.hasPermission('VIEW_AUDIT_LOG' || 'MANAGE_MESSAGES')) return
    return channel.send(`:no_entry_sign: You don't have access to that command!`)
        .catch(err => console.log(err));
}

module.exports = METHODS;