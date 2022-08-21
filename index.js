const Discord = require('discord.js');
const Sequelize = require('sequelize');

const config = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');


const { Client, Collection, GatewayIntentBits, messageLink } = require('discord.js');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ]
});



// // defining connection information
// const sequelize = new Sequelize('database', 'user', 'password', {
// 	// tells sqlize where to look for database
//     host: 'localhost',
//     // database engine we using
// 	dialect: 'sqlite',
//     //enables verbose output (useful for debugging)
// 	logging: false,
// 	// SQLite only setting, sqlite only database that stores all data to a single file
// 	storage: 'database.sqlite',
// });


/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) (STRING) UNIQUE,
 * description TEXT,
 * username VARCHAR(255) (STRING),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */

// sequelize.define() takes two params

// tags are passed as name of table + object
// representing table's schema in key-value pairs
// const Tags = sequelize.define('tags', {
// 	name: {
//         // type = what kind of data this attribute should hold
//         // most common are num, string, date
// 		type: Sequelize.STRING,
//         // ensure that this field will not have duplicate entries
//         // not allowed in database
// 		unique: true,
// 	},
// 	description: Sequelize.TEXT,
// 	username: Sequelize.STRING,
// 	usage_count: {
// 		type: Sequelize.INTEGER,
//         // set a fallback value if no initial value during insert
// 		defaultValue: 0,
//         // guarantee in database that attribute is never unset
// 		allowNull: false,
// 	},
// });
// note: str length in most databases is fixed length (performance)
// sqlize defaults to 255 - use string if input has max length
// use text if it does not
// for sqlite, no unbounded string type, so it will not matter which one you pick




// dynamically retrieving all event files in /events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// dynamically taking all commands in commands folder
client.commands = new Collection();

// The node core module 'path' and it's join() method will help to construct a path and store it in a constant so you can reference it later.
const commandsPath = path.join(__dirname, 'commands');

// the fs.readdirSync() method will return an array of all the file names in the directory, e.g. ['ping.js', 'beep.js']
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// To ensure only command files get returned, use Array.filter() to leave out any non-JavaScript files from the array. With that array, loop over it and dynamically set your commands to the client.commands Collection.
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// // TODO: pls put these two events in events folder
// client.once('ready', () => {
// 	Tags.sync();
// 	console.log(`Logged in as ${client.user.tag}!`);
// });


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    // First, fetch the command in the Collection with that name and
    // assign it to the variable command. If the command doesn't exist, 
    // it will return undefined, so exit early with return. If it does exist, 
    // call the command's .execute() method, and pass in the interaction variable 
    // as its argument. In case something goes wrong, log the error and report 
    // back to the member to let them know.
    const command = client.commands.get(interaction.commandName);

	if (!command) return;

    
	// // -------------------------------------
	// // RESETTING COMMANDS IF GLOBAL/GUILD ARE DUPLICATED
	// const guild = client.guilds.cache.get("1008901914865434724");
	// 	// test-server guildID

	// 	// This takes ~1 hour to update
	// 	client.application.commands.set([]);

	// 	// This updates immediately
	// 	guild.commands.set([]);
	// 	console.log('commands reset')
	// ------------------------------------------

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})




client.login(config.token);

// console.log("this don't work??")
