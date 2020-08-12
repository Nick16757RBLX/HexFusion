// DBSetup.js
// Handler used to setup databases
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./internals/DATA/infractions.sqlite');

var methods = {};

methods.setupDatabase = function () {
    // create data tables
    const infractiondata = sql1.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'infractions';").get();

    // create datas
    if (!infractiondata['count(*)']) {
        // create infractions data
        sql1.prepare("CREATE TABLE infractions (id TEXT, user TEXT, userID TEXT, reason TEXT, casenum INTEGER PRIMARY KEY, mod TEXT, modID TEXT, type TEXT, time TEXT, timestamp TEXT);").run();
        sql1.prepare("CREATE TABLE datavalues (id TEXT PRIMARY KEY, cases INTEGER);").run();
        sql1.prepare("CREATE TABLE userdta (id TEXT PRIMARY KEY, infractions INTEGER);").run();
        sql1.prepare("CREATE TABLE guildoptionsmods (id TEXT, roleid TEXT PRIMARY KEY, muteAllowed BOOL, kickAllowed BOOL, banAllowed BOOL, warnAllowed BOOL, durationAllowed BOOL, cleanAllowed BOOL, configAllowed BOOL, allowModificationOfOth BOOL);").run();
        sql1.prepare("CREATE TABLE guildoptions (id TEXT PRIMARY KEY, commandsChannel TEXT, logsEnabled BOOL, punishChannel TEXT, comuseChannel TEXT, alertsChannel TEXT);").run();
        // create a new insert that is unique, ensure it is unique or it won't work
        sql1.prepare("CREATE UNIQUE INDEX idx_infractions_casenum ON infractions (casenum);").run();
        sql1.prepare("CREATE UNIQUE INDEX idx_datavalues_id ON datavalues (id);").run();
        sql1.prepare("CREATE UNIQUE INDEX idx_userdta_id ON userdta (id);").run();
        sql1.prepare("CREATE UNIQUE INDEX idx_guildoptionsmods_roleid ON guildoptionsmods (roleid);").run();
        sql1.prepare("CREATE UNIQUE INDEX idx_guildoptions_id ON guildoptions (id);").run();
    }

}

methods.setClientCommands = function (client) {
    // act: setup the client commands for sql data or externals
    client.getInfs = sql1.prepare("SELECT * FROM infractions WHERE id = ?");
    client.setInfs = sql1.prepare("INSERT INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
    client.updInfs = sql1.prepare("REPLACE INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
    client.getDta = sql1.prepare("SELECT * FROM datavalues WHERE id = ?");
    client.setDta = sql1.prepare("INSERT OR REPLACE INTO datavalues (id, cases) VALUES (@id, @cases);");
    client.getInfrs = sql1.prepare("SELECT * FROM userdta WHERE id = ?");
    client.setInfrs = sql1.prepare("INSERT OR REPLACE INTO userdta (id, infractions) VALUES (@id, @infractions);");
    client.getRolePerms = sql1.prepare("SELECT * FROM guildoptionsmods WHERE id = ? AND roleid = ?");
    client.setRolePerms = sql1.prepare("INSERT OR REPLACE INTO guildoptionsmods (id, roleid, muteAllowed, kickAllowed, banAllowed, warnAllowed, durationAllowed, cleanAllowed, configAllowed, allowModificationOfOth) VALUES (@id, @roleid, @muteAllowed, @kickAllowed, @banAllowed, @warnAllowed, @durationAllowed, @cleanAllowed, @configAllowed, @allowModificationOfOth);")
    client.getGuildOptions = sql1.prepare("SELECT * FROM guildoptions WHERE id = ?");
    client.setGuildOptions = sql1.prepare("REPLACE INTO guildoptions () VALUES ();");
}

module.exports = methods;