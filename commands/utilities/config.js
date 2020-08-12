// config.js
// configuration for the bot

module.exports = {
    name: "config",
    category: "utilities",
    usage: "{argument}",
    description: "Get a list of bot configurations",
    argsreq: true,
    guildOnly: true,
    execute: async function (message, args, client) {
        // configuration source code
        // variables
        const rolesCache = message.member.roles.cache; // get member roles cache
        let allowedRles = rolesCache.some(role => role.name === 'Chat Moderator' || role.name === 'lead');



    }
}