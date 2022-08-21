const { SlashCommandBuilder } = require('discord.js');

// const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
// interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('reacts with 😄'),
	async execute(interaction) {
        const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
		message.react('😄');
	},
};