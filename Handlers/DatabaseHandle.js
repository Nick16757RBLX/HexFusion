// DatabaseHandle.js
/*
    * This handler handles all database functions including: creation, modification, deletion, etc. DO NOT REMOVE! MAY CAUSE ISSUES
 */
// (!) REQUIRED EXTERNAL LIBRARIES (!)
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");

// (!) REQUIRED INTERNAL FILES (!)
const sql = new SQLite('./Database/guilddatabase.sqlite', {verbose: console.log });

// (!) REQUIRED INTERNAL LIBRARIES (!)
const client = new Discord.Client();
client.commands = new Discord.Collection();

var DatabaseHandle = {};

DatabaseHandle.setupDataBase = function (client) {
    // Create a new database.
    // Check if the current database exists or not.
    const GuildData = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'ginfo';").get();
    const Modules = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'modules';").get();
    if (!GuildData['count(*)']) {
        // create a new database for guild data.
        sql.prepare("CREATE TABLE IF NOT EXISTS userdata (guildid TEXT PRIMARY KEY, userID TEXT, infracts INTEGER);").run();
        sql.prepare("CREATE TABLE IF NOT EXISTS permissions (guildid TEXT, roleid TEXT PRIMARY KEY, command TEXT, enabled INTEGER);").run();
        sql.prepare("CREATE TABLE IF NOT EXISTS infraref (guildid TEXT PRIMARY KEY, userID TEXT, type TEXT, reason TEXT, casenum INTEGER, modID TEXT, muteTime TEXT);").run();
        // create unique indexes.
        sql.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_ud ON userdata (userID, infracts);").run();
        sql.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pms ON permissions (roleid);").run();
        sql.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_inf_csn ON infraref (casenum);").run();
    }
    if (!Modules['count(*)']) {
        // create a new database for bot modules.
        sql.prepare("CREATE TABLE IF NOT EXISTS verifyModule (guildid TEXT PRIMARY KEY, modEnabled INTEGER, verifyChannel TEXT, verifyMessage TEXT, logMessages INTEGER, reqConfirm INTEGER);").run();
        sql.prepare("CREATE TABLE IF NOT EXISTS modModule (guildid TEXT PRIMARY KEY, modEnabled INTEGER, defaultReason TEXT, modifyOthers INTEGER);").run();
        // create unique indexes.
        sql.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_VM_stn ON verifyModule (guildid, modEnabled, verifyChannel);").run();
        sql.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_MD_stn ON modModule (guildid, modEnabled, modifyOthers);").run();
    }

    // set the Commands
    //-- GET/SET USER DATA
    client.getUserInfractionsByID = sql.prepare('SELECT infracts FROM userdata WHERE guildid = ? AND userID = ?'); // get user data from id
    client.setUserInfractionsByID = sql.prepare('INSERT OR REPLACE INTO userdata (guildid, userID, infracts) VALUES (?, ?, ?);'); // set users infractions by id

    //-- get/set infraction history
    client.getInfractHistoryFromGuild = sql.prepare('SELECT * FROM infraref WHERE guildid = ?'); // get infractions from the guild
    client.getInfractionHistoryFromCase = sql.prepare('SELECT * FROM infraref WHERE guildid = ? AND casenum = ?'); // get infractions from the casenum
    client.getInfractionHistoryFromMod = sql.prepare('SELECT * FROM infraref WHERE guildid = ? AND modID = ?'); // get infractions from the mods id

    client.addInfractToUser = sql.prepare('INSERT OR REPLACE INTO infraref (guildid, userID, type, reason, casenum, modID, muteTime) VALUES (?, ?, ?, ?, ?, ?, ?);'); // add infraction by id

    //-- GET/SET ROLE PERMISSIONS
    client.getRolePermissionsFromCMD = sql.prepare('SELECT roleid, command FROM permissions WHERE guildid = ? AND command = ?'); // get command permissions by command
    client.setRolePermissionsByID = sql.prepare('INSERT OR REPLACE INTO permissions (guildid, roleid, command, enabled) VALUES (?, ?, ?, ?);'); // set permissions

    //-- verify module settings (GET/SET)
    client.getVerificationModuleFromID = sql.prepare('SELECT * FROM verifyModule WHERE guildid = ?'); // get verification module settings
    client.setVerificationModSettings = sql.prepare('INSERT OR REPLACE INTO verifyModule (guildid, modEnabled, verifyChannel, verifyMessage, logMessages, reqConfirm) VALUES (?, ?, ?, ?, ?, ?);');

    //-- infraction module settings (GET/SET)
    client.getModerationModuleFromID = sql.prepare('SELECT * FROM modModule WHERE guildid = ?'); // get moderation module settings
    client.setModerationModSettings = sql.prepare('INSERT OR REPLACE INTO modModule (guildid, modEnabled, defaultReason, modifyOthers) VALUES (?, ?, ?, ?);');
}

DatabaseHandle.getUserPermissionsFromCMD = function (client, message, commandName) {
    const GuildID = message.channel.guild; // return the guilds id
    /*
        * This command will grab the permissions database and check if the user has permission to the command.
        * Check the users permissions:
            * If the user HAS permission the command will execute successfully.
            * If the user DOES NOT have permission there will be extra checks to see if they have special permissions. (*) These can be set using +config
        * Run the command
     */
    const getPermissionsList = client.getRolePermissionsFromCMD.all(GuildID.id, commandName);

    for (const permFill of getPermissionsList) {
        // get the users roles and check if they have it.
        const checkRoles = message.member.roles.cache.find(r => r.id === permFill.roleid);
        return !!checkRoles;
    }
}

module.exports = DatabaseHandle;