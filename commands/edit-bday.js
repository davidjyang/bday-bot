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
		.setName('edit-bday')
		.setDescription("edits existing birthday!")
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

        // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
        const affectedRows = await Tags.update({ birthday: tagDescription }, { where: { name: tagName } });

        if (affectedRows > 0) {
            return interaction.reply(`${tagName}\'s birthday was edited.`);
        }

        return interaction.reply(`Could not find ${tagName}\'s birthday.`);
        
    }
}

