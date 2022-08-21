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
		.setName('delete-bday')
		.setDescription('deletes a bday')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of person')
                .setRequired(true)),
                
	async execute(interaction) {

        const tagName = interaction.options.getString('name');
	// equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply(` ${tagName}\'s birthday isn\'t recorded.`);

        return interaction.reply('Birthday deleted.');
    }
};
