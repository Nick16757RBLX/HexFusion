// MemberHandle.js
// Handles role collection and Commands/functions
var memberHandle = {};

memberHandle.GetMemberRolesByID = function (message) {
    /*
        * This command will get a members roles.
        * It will then return the roles back to the original caller.
     */
    const tabre = [];
    message.member.roles.cache.forEach(r => {
        tabre.push(r.id);
    })
    return tabre;
}

memberHandle.GetMemberByID = function (message, id) {
    /*
        * This command will check if the user is in the server.
        * If they're in the server it will return back (true) otherwise (false)
     */
    const memberID = message.guild.members.cache.get(id); // members id
    return memberID;
}

memberHandle.GetServerRoles = function (message) {
    // get all server roles from the guild.
    const tab = []; // temp table holder
    const guildRoles = message.channel.guild.roles.cache;
    guildRoles.forEach(r => {
        tab.push(r);
    })
    tab.splice(0, 1).map(r1 => r1).join(`, `);
    return tab;
}

module.exports = memberHandle;