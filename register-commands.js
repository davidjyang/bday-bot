const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '1008900501833785404';
// this is test-server guildID but it's technically not used
// because this script registers commands globally
const guildId = '1008901914865434724';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
