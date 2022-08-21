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
		.setName('show-bdays')
		.setDescription('shows all birthdays!'),
        
	async execute(interaction) {

        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No birthdays set.';

        return interaction.reply(`List of people with registered birthdays: ${tagString}`);
    }
};
