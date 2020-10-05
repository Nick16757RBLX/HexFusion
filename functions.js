const { MessageEmbed: MessageEmbed } = require('discord.js');
const { MOD_NOT_ENABLED, INVALIDPERMISSIONS} = require('./Handlers/ErrorHandler');


module.exports = {
    // permission and module check
    checkPermissions: function (message, client, command) {
        const { member: member, guild: guild } = message; // get class type from message (member, guild)
        const getMemberPermissions = client.getRolePermissions.all(guild.id, command);
        const getMemberPermNames = client.getGlobalPermissions.all(guild.id, command);

        for (const {roleid} of getMemberPermissions) {
            // (?) get the (roleid) from member permissions
            const getRole = member.roles.cache.find(r => r.id === roleid);
            if (!getRole && !member.hasPermission("ADMINISTRATOR")) {
                // (?) check if the member has member permissions
                for (const {type} of getMemberPermNames) {
                    // (?) get the (type) from member permissions
                    if (!member.hasPermission(type)) {
                        return INVALIDPERMISSIONS(message);
                    }
                }
            }
        }
    },

    checkModuleStatusOfModeration: function (message, client) {
        const { guild: guild } = message; // get class/function types from message
        const GuildID = guild.id;
        const getGuildInformation = client.getModerationModule.all(GuildID);

        for (const {guildid} of getGuildInformation) {
            // (?) get the (guildid) from guild
            if (!guildid) return MOD_NOT_ENABLED(message);
        }
    },

    checkModuleStatusOfVerification: function (message, client) {
        const { guild: guild } = message; // get class/function types from message
        const GuildID = guild.id;
        const getGuildInformation = client.getVerificationModule.all(GuildID);

        for (const {guildid} of getGuildInformation) {
            // (?) get the (guildid) from guild
            if (!guildid) return MOD_NOT_ENABLED(message);
        }
    },

    // moderation embed functions
    createInformationEmbed: function (message, client, memberID) {
        const { guild: GuildClass } = message; // get class/function types from message
        const UserInformation = client.getUserData.all(GuildClass.id, memberID.user.id)[0];
        const EmbeddedMessage = new MessageEmbed();
        const memberRoles = message.channel.guild.member(memberID).roles;

        EmbeddedMessage
            .setAuthor(memberID.user.tag, memberID.user.avatarURL())
            .setThumbnail(memberID.user.avatarURL())
            .setColor("#e79b61")
            .setFooter(`Viewing member information of ❯ ${memberID.user.tag}`)
            .addField(`Additional information:`, `
            Roles: ${memberRoles.cache.size} (${memberRoles.highest})
            `)
            .setTimestamp()

        if (UserInformation) {
            // (!) User has infraction history
                EmbeddedMessage.setDescription(`**❯ Member Information**
                    Profile: ${memberID.user} (\`${memberID.user.id}\`)
                    Status: ${memberID.user.presence.status}
                    Created: ${memberID.user.createdAt}
                    **❯ Member Infractions**
                    Total Infractions: ${UserInformation.infractions}`)
        } else {
            // (!) User doesn't have infraction history
            EmbeddedMessage.setDescription(`**❯ Member Information**
                    Profile: ${memberID.user} (\`${memberID.user.id}\`)
                    Status: ${memberID.user.presence.status}
                    Created: ${memberID.user.createdAt}`)
        }

        return EmbeddedMessage;
    },

    // global functions
    fetchMember: async function (message, member) {
        const {mentions: MentionsClass} = message; // get class/function types from message
        return await message.channel.guild.members.cache.get(member) || MentionsClass.members.first();
    }

}