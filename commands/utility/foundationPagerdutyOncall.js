const { SlashCommandBuilder } = require('discord.js');
const { fetch } = require('node-fetch-commonjs');

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

    try {
      console.log(await res.text());
      console.log(await res.json());
    } catch (err) {
      console.log(err);
    }

		return interaction.reply(`testing`);
	},
};
