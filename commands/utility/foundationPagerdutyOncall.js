const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const { FOUNDATION_DISCORD_USER_MAP, PAGERDUTY_CLIENT_ID, PAGERDUTY_CLIENT_SECRET } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foundation-oncall')
		.setDescription('Display active Foundation On-Call team members.'),
	async execute(interaction) {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', PAGERDUTY_CLIENT_ID);
    body.append('client_secret', PAGERDUTY_CLIENT_SECRET);
    body.append('scope', 'as_account-us.helium-foundation oncalls.read');

    const oathRes = await fetch('https://identity.pagerduty.com/oauth/token', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const { access_token } = await oathRes.json();

    const oncallsRes = await fetch('https://api.pagerduty.com/oncalls', { 
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await oncallsRes.json();
    const userMap = JSON.parse(FOUNDATION_DISCORD_USER_MAP);

    let onCallUsers = '';
    json.oncalls.forEach((group) => {
      if (group.escalation_level === 1) {
        const user = group.user.summary;
        onCallUsers += `**${group.schedule.summary}**: ${user} (${userMap[user]})\n`
      }
    });

		return interaction.reply(`${onCallUsers}`);
	},
};
