const { SlashCommandBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

// FETCH TAG FUNCTIONALITY

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
		.setName('bday')
		.setDescription('fetches bday!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of person')
                .setRequired(true)),
                
	async execute(interaction) {

        const tagName = interaction.options.getString('name');

	// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {            
            return interaction.reply(tag.get('birthday'));
        }

	    return interaction.reply(`Could not find person's birthday: ${tagName}`);

	},
};
