// info.js
// version 1.0

// (!) INTERNAL/EXTERNAL FILES
const { USERNOTFOUND } = require('../../Handlers/ErrorHandler');
const { checkModuleStatusOfModeration: IsModuleEnabled, createInformationEmbed: crtUserInfo, fetchMember: member } = require('../../functions');

// COMMAND PROCESS / SOURCE
/* This command is only accessible if the moderation module is enabled! */

module.exports = {
    name: "info",
    category: "moderation",
    aliases: ['userinfo'],
    usage: "{snowflake: id}",
    description: "Get a members information",
    guildOnly: true,
    run: async function (message, args, client) {
        // start of (info command module)
        const memberID = member(message, args[0]);
        const Embed = crtUserInfo(message, client, memberID);

        // ($) Check module status
        IsModuleEnabled(message, client);

        // ($) Check arguments and information from args
        if (!args.length) return;
        if (!memberID) return USERNOTFOUND(message, args[0]);

        // (!) Perform command
        return message.channel.send(Embed);
    }
}
