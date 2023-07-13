const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foundation')
		.setDescription('Display active Foundation On-Call team members.'),
	async execute(interaction) {
    const res = await fetch('https://api.pagerduty.com/oncalls', {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Token token=${process.env.FOUNDATION_PAGERDUTY_API_KEY}`,
      'Content-Type': 'application/json'
    });
    const resJson = await res.json();
    console.log(resJson);
		return interaction.reply(`testing`);
	},
};
