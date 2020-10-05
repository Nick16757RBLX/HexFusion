// DatabaseHandlerdisconnect.js
// version 2.0

// (!) ALTERNATE INTERNAL/EXTERNAL LIBRARIES
const SQLite = require("better-sqlite3");

// (!) INTERNAL/EXTERNAL FILES
const gdata = new SQLite('./Database/guilddata.sqlite');

// COMMAND PROCESS / SOURCE
/* The bot framework depends on this file to handle database connections. */

const DataBaseModule = {}

DataBaseModule.setupGlobalDatabase = function (client) {
    // (?) Creates a new database using better-sqlite3 => * The bot depends on this service to operate. Without it the bot may not function correctly.
    const GuildData = gdata.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guilddata';").get();
    const InfractionData = gdata.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'infData';").get();
    const PermissionData = gdata.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'permissions';").get();

    // (?) Create tables within the data tables

    if (!GuildData['count(*)']) {
        // (?) Create a guild data table (when no table exists)
        gdata.prepare("CREATE TABLE IF NOT EXISTS globalData (guildid TEXT PRIMARY KEY, cases INTEGER);").run();
        gdata.prepare("CREATE TABLE IF NOT EXISTS verifyModule (guildid TEXT PRIMARY KEY, requireAuth INTEGER);").run();
        gdata.prepare("CREATE TABLE IF NOT EXISTS modModule (guildid TEXT PRIMARY KEY, defaultReason TEXT, modifyOthers INTEGER);").run();

        // (?) Create unique indexes (prevents data from being duplicated)
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_G_cs ON globalData (guildid, cases);").run();
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_G_vM ON verifyModule (guildid, requireAuth);").run();
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_G_mM ON modModule (guildid, defaultReason, modifyOthers);").run();
    }

    if (!InfractionData['count(*)']) {
        // (?) Create a guild data table (when no table exists)
        gdata.prepare("CREATE TABLE IF NOT EXISTS infractions (guildid TEXT PRIMARY KEY, user TEXT, type TEXT, reason TEXT, casenum INTEGER, mod TEXT, muteTime TEXT);").run();
        gdata.prepare("CREATE TABLE IF NOT EXISTS userdata (guildid TEXT PRIMARY KEY, userid TEXT, infractions INTEGER, isMuted TEXT);").run();

        // (?) Create unique indexes (prevents data from being duplicated)
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_G_inf ON infractions (casenum);").run();
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_G_inf ON userdata (guildid, infractions);").run();
    }

    if (!PermissionData['count(*)']) {
        // (?) Create a guild data table (when no table exists)
        gdata.prepare("CREATE TABLE IF NOT EXISTS permissions (guildid TEXT PRIMARY KEY, roleid TEXT, command TEXT);").run();
        gdata.prepare("CREATE TABLE IF NOT EXISTS gblpermissions (guildid TEXT PRIMARY KEY, type TEXT, command TEXT);").run();

        // (?) Create unique indexes (prevents data from being duplicated)
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pms ON permissions (roleid);").run();
        gdata.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pms_set ON gblpermissions (type);").run();
    }

    // (?) Create client commands
        // (?) Create (userdata) commands
        client.getUserData = gdata.prepare('SELECT * FROM userdata WHERE guildid = ? AND userid = ?');
        client.setUserData = gdata.prepare('INSERT OR REPLACE INTO userdata (guildid, userID, infractions) VALUES (?, ?, ?);');

        // (?) Create (infraction) commands
        client.getInfractHistoryFromGuild = gdata.prepare('SELECT * FROM infractions WHERE guildid = ?');
        client.getInfractHistoryFromCase = gdata.prepare('SELECT * FROM infractions WHERE guildid = ? AND casenum = ?');
        client.getInfractHistoryFromMod = gdata.prepare('SELECT * FROM infractions WHERE guildid = ? AND mod = ?');

        client.setUserInfraction = gdata.prepare('INSERT OR REPLACE INTO infractions (guildid, user, type, reason, casenum, mod, muteTime) VALUES (?, ?, ?, ?, ?, ?, ?);');

        // (?) Create (permission) commands #1
        client.getRolePermissionsListByID = gdata.prepare('SELECT command FROM permissions WHERE guildid = ? AND roleid = ?');
        client.getRolePermissions = gdata.prepare('SELECT roleid, command FROM permissions WHERE guildid = ? AND command = ?');

        client.setRolePermissions = gdata.prepare('INSERT OR REPLACE INTO permissions (guildid, roleid, command) VALUES (?, ?, ?);')

        // (?) Create (permission) commands #2
        client.getGlobalPermissionsFromRole = gdata.prepare('SELECT command FROM gblpermissions WHERE guildid = ?');
        client.getGlobalPermissions = gdata.prepare('SELECT type, command FROM gblpermissions WHERE guildid = ? AND command = ?');

        client.setGlobalPermissions = gdata.prepare('INSERT OR REPLACE INTO gblpermissions (guildid, type, command) VALUES (?, ?, ?);')

        // (?) Create (verification) commands
        client.getVerificationModule = gdata.prepare('SELECT guildid FROM verifyModule WHERE guildid = ?');
        client.setVerificationModule = gdata.prepare('INSERT OR REPLACE INTO verifyModule (guildid, requireAuth) VALUES (?, ?);');

        // (?) Create (moderation) commands
        client.getModerationModule = gdata.prepare('SELECT guildid FROM modModule WHERE guildid = ?');
        client.setModerationModule = gdata.prepare('INSERT OR REPLACE INTO modModule (guildid, defaultReason, modifyOthers) VALUES (?, ?, ?);');

    // end client commands
}

module.exports = DataBaseModule;
