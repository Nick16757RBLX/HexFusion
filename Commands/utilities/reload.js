// reload.js
/*
    * this command will reload the commands and add new ones that were added to the directory.
 */
// (!) REQUIRED INTERNAL FILES (!)
const Indexer = require('../../Handlers/Indexer');
const ErrorHandle = require('../../Handlers/ErrorHandle');

// Main Source
module.exports = {
    name: "reload",
    aliases: ['reload'],
    description: "Reload commands",
    special_perms: ["ADMINISTRATOR"],
    guildOnly: true,
    execute: async function (message, args, client) {
        const MemberClass = message.member;
        /*
            * This command will reload all commands.
                * ONLY can be used by an ADMINISTRATOR.
                * This command will hopefully fix issues with certain commands.
            * Check if --force was assigned.
                * If so: continue without cooldown (can cause errors possibly) (not tested)
                * If not: wait for cooldown. (recommended) //TODO add cooldowns
         */
        if (!MemberClass.hasPermission(this.special_perms)) {
            return ErrorHandle.INVALIDPERMISSIONS(message, this.name, true);
        } // Permission check #2
        Indexer.setPluginCommands(client);
        Indexer.setClientCommands(client);
        return message.channel.send(`:white_check_mark: Successfully reloaded commands. If an error occurs please report it!`).then(msg => {
            msg.delete({timeout: 10000});
        })
    }
}