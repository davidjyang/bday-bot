const fs = require('node:fs');
const path = require('node:path')

const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');


// if confused, check the index.js equivalent
const commands = []
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// only diff from index.js code is that we take the json data as well
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
// ____________________________________________________________________________________________________



// // const { REST } = require('@discordjs/rest');
// // const { Routes } = require('discord.js');
// // const { token } = require('./config.json');
// // const fs = require('node:fs');

// const commands = [];
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// // Place your client and guild ids here
// // const clientId = '123456789012345678';
// // const guildId = '876543210987654321';

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	commands.push(command.data.toJSON());
// }

// const rest = new REST({ version: '10' }).setToken(token);

// (async () => {
// 	try {
// 		console.log('Started refreshing application (/) commands.');

// 		await rest.put(
// 			Routes.applicationGuildCommands(clientId, guildId),
// 			{ body: commands },
// 		);

// 		console.log('Successfully reloaded application (/) commands.');
// 	} catch (error) {
// 		console.error(error);
// 	}
// })();
