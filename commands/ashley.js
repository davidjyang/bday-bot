const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ashley')
		.setDescription('ashley is cool'),
	async execute(interaction) {
        await interaction.reply("😍")
		
	},
};