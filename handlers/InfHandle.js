// InfHandler.js
// Handles the creation of infraction data
const Discord = require('discord.js');

var InfHandler = {}

InfHandler.addNewInfraction = function (client, message, memberID, reason, type, time) {
    // add a new infraction to the user: memberID
    let infractions;
    let userinfs;

    infractions = client.getInfs.get(`${memberID.user.id}-${message.channel.guild.id}`);
    cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists

    // internal functions

    function setUserInfs() {
        // sets the users infractions
        userinfs = client.getInfrs.get(memberID.user.id); // get the users infractions and check if they have any

        if (!userinfs) {
            // create user infractions
            userinfs = {
                id: memberID.user.id,
                infractions: 0,
            }
        }
        userinfs.infractions++; // increase the infraction count
    }

    function setInfractions() {
        // add an infraction
        infractions = {
            id: `${memberID.user.id}-${message.channel.guild.id}`,
            user: memberID.user.username,
            userID: memberID.user.id,
            reason: reason,
            casenum: cases.cases,
            mod: message.author.username,
            modID: message.author.id,
            type: type,
            time: time,
            timestamp: message.createdAt.toDateString(),
        }
    }

    // perform the functions

    setInfractions();
    setUserInfs();

    // set and async the results
    client.setInfrs.run(userinfs);
    client.setInfs.run(infractions);

}

InfHandler.SetCases = function (client, message) {
    // add to the case count
    cases = client.getDta.get(message.guild.id); // get the cases and check if cases exists

    if (!cases) {
        // create cases
        cases = {
            id: `${message.guild.id}`,
            cases: 0,
        }
    }
    cases.cases++;

    client.setDta.run(cases);
}

module.exports = InfHandler;