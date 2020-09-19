// server-info.js
/*
    * this command will grab all server information.
 */
// (!) REQUIRED EXTERNAL LIBRARIES (!)
const Discord = require('discord.js');

// (!) REQUIRED INTERNAL FILES (!)
const MemberHandle = require('../../Handlers/MemberHandle');
const DatabaseHandle = require('../../Handlers/DatabaseHandle');
const ErrorHandle = require('../../Handlers/ErrorHandle');

// Internal
const CreateEmbed = new Discord.MessageEmbed();


// Main Source
module.exports = {
    name: "server-info",
    aliases: ['sinfo'],
    description: "Get server information",
    special_perms: ['MANAGE_MESSAGES', "ADMINISTRATOR"],
    guildOnly: true,
    execute: async function (message, args, client) {
        const MemberClass = message.member;
        const RolesClass = message.channel.guild.roles.cache;
        /*
            * This command will grab server information from the guild.
            * Check the users permissions:
                * If the user HAS permission the command will execute successfully.
                * If the user DOES NOT have permission there will be extra checks to see if they have special permissions. (*) These can be set using +config
            * Create an message embed with server information and information tab.
            * Finish & process command :)
            * (*) This command has SPECIAL ARGUMENTS
         */
        const hasPermission = DatabaseHandle.getUserPermissionsFromCMD(client, message, this.name); // Permission check
        if (!hasPermission && !MemberClass.hasPermission(this.special_perms)) {
            return ErrorHandle.INVALIDPERMISSIONS(message, this.name, true);
        } // Permission check #2

        switch (args[0]) {
            case "members": // display member count
                subArgument_MemberCount(message);
                break;
            case "roles": // display role count

                break;
            default:
                break;
        }

    }
}

// Internal functions
function subArgument_MemberCount (message) {
    const Members = message.channel.guild.members.cache;
    let memberCount = []; // table to hold members
    let botCount = []; // table to hold bots
        /*
        * Get all members from server:
            * Display (online users, offline users).
            * Display the average count of roles a user has.
            * Display the user with more message count.
     */

}

function subArgument_RolesCount (message) {
    /*
        * Display role count w/ roles
     */

}


//TODO Figure out how to determine the difference between a bot and member