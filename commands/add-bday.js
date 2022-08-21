const { SlashCommandBuilder } = require('discord.js');
const { ready } = require('../events/ready')
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
    .setName('add-bday')
    .setDescription('adds a birthday!')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('name of person')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('birthday')
            .setDescription('birthday')
            .setRequired(true)), 
    
	async execute(interaction) {
        const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('birthday');

        try {
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            // const tag = await Tags.create({

            const tag = await Tags.create({
                name: tagName,
                birthday: tagDescription,
            });
            console.log(tag.toJSON())
            return interaction.reply(`${tag.name} added.`);
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('That person already has a birthday in here!');
            }
    
            return interaction.reply('Something went wrong with adding a tag.');
        }
	},
};