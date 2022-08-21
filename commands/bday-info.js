const { SlashCommandBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');


// const sequelize = new Sequelize('database', 'user', 'password', {
const sequelize = new Sequelize('sqlite::memory:', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

const Tags = sequelize.define('Tags', {
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    birthday: { 
        type: DataTypes.DATEONLY,
    }
});
    
Tags.sync( { force: true })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bday-info')
		.setDescription('fetches information about the birthday entry!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of person')
                .setRequired(true)),
                
	async execute(interaction) {

        const tagName = interaction.options.getString('name');

	    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
        // better idea to just have a column recording which user made which entry
        // and call that column here
        if (tag) {
            return interaction.reply(`${tagName}\'s birthday entry was created by ${tag.username} at ${tag.createdAt}.`);
        }

        return interaction.reply(`Could not find person\'s birthday: ${tagName}`);
    }
};
