const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foundation')
		.setDescription('Display active Foundation On-Call team members.'),
	async execute(interaction) {
    const res = await fetch('https://api.pagerduty.com/oncalls', { 
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Token token=${process.env.FOUNDATION_PAGERDUTY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json()

		return interaction.reply(`${json.oncalls[0].user.summary}`);
	},
};
