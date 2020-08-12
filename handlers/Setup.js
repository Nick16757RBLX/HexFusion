// command handler/setup system
// version 1.0
const { readdirSync } = require('fs'); // fs

module.exports = (client) => {
    readdirSync(`./commands/`).forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of commands) {
            let pullFile = require(`../commands/${dir}/${file}`);

            if (pullFile.name) {
                client.commands.set(pullFile.name, pullFile);
            }

        }

    })
}
