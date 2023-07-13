const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('Foundation')
		.setDescription('Display active Foundation On-Call team members.'),
	async execute(interaction) {
		return interaction.reply(`testing`);
	},
};
