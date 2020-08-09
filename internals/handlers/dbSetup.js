// dbSetup.js
// Handler used to setup databases
const SQLite = require("better-sqlite3");
const sql1 = new SQLite('./internals/DATA/infractions.sqlite');
const sql2 = new SQLite('./internals/DATA/datavals.sqlite');
const sql3 = new SQLite('./internals/DATA/userdta.sqlite');

function setupDatabase() {
    // create data tables
    const infractiondata = sql1.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'infractions';").get();
    const datavalues = sql2.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'datavalues';").get();
    const userdata = sql3.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userdta';").get();

    // create datas
    if (!infractiondata['count(*)']) {
        // create infractions data
        sql1.prepare("CREATE TABLE infractions (id TEXT, user TEXT, userID TEXT, reason TEXT, casenum INTEGER PRIMARY KEY, mod TEXT, modID TEXT, type TEXT, time TEXT, timestamp TEXT);").run();
        // create a new insert that is unique, ensure it is unique or it won't work
        sql1.prepare("CREATE UNIQUE INDEX idx_infractions_casenum ON infractions (casenum);").run();
    }
    if (!datavalues['count(*)']) {
        // create infractions data
        sql2.prepare("CREATE TABLE datavalues (id TEXT PRIMARY KEY, cases INTEGER);").run();
        // create a new insert that is unique, ensure it is unique or it won't work
        sql2.prepare("CREATE UNIQUE INDEX idx_datavalues_id ON datavalues (id);").run();
    }
    if (!userdata['count(*)']) {
        // create infractions data
        sql3.prepare("CREATE TABLE userdta (id TEXT PRIMARY KEY, infractions INTEGER);").run();
        // create a new insert that is unique, ensure it is unique or it won't work
        sql3.prepare("CREATE UNIQUE INDEX idx_userdta_id ON userdta (id);").run();
    }
}

function setClientCommands(client) {
    // act: setup the client commands for sql data or externals
    client.getInfs = sql1.prepare("SELECT * FROM infractions WHERE id = ?");
    client.setInfs = sql1.prepare("INSERT INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
    client.updInfs = sql1.prepare("REPLACE INTO infractions (id, user, userID, reason, casenum, mod, modID, type, time, timestamp) VALUES (@id, @user, @userID, @reason, @casenum, @mod, @modID, @type, @time, @timestamp);");
    client.getDta = sql2.prepare("SELECT * FROM datavalues WHERE id = ?");
    client.setDta = sql2.prepare("INSERT OR REPLACE INTO datavalues (id, cases) VALUES (@id, @cases);");
    client.getInfrs = sql3.prepare("SELECT * FROM userdta WHERE id = ?");
    client.setInfrs = sql3.prepare("INSERT OR REPLACE INTO userdta (id, infractions) VALUES (@id, @infractions);");
}

module.exports = (client) => {
    // Database setup + setup the databases and tables within them
    setupDatabase();
    setClientCommands(client);
    console.log(`Finished setting up databases`);
}