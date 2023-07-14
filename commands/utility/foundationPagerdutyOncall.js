const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const { FOUNDATION_DISCORD_USER_MAP, FOUNDATION_PAGERDUTY_API_KEY } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foundation')
		.setDescription('Display active Foundation On-Call team members.'),
	async execute(interaction) {
    const res = await fetch('https://api.pagerduty.com/oncalls', { 
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Token token=${FOUNDATION_PAGERDUTY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();
    const userMap = JSON.parse(FOUNDATION_DISCORD_USER_MAP);

    let onCallUsers = '';
    json.oncalls.forEach((group) => {
      if (group.escalation_level === 1) {
        const user = group.user.summary;
        onCallUsers += `${group.schedule.summary}: ${user} (${userMap[user]})\n`
      }
    });

    console.log(userMap);
    console.log(onCallUsers);

		return interaction.reply(`${onCallUsers}`);
	},
};
