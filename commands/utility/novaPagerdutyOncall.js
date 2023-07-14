const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const { NOVA_PAGERDUTY_CLIENT_ID, NOVA_PAGERDUTY_CLIENT_SECRET } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nova-oncall')
		.setDescription('Display active Nova On-Call team members.'),
	async execute(interaction) {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', NOVA_PAGERDUTY_CLIENT_ID);
    body.append('client_secret', NOVA_PAGERDUTY_CLIENT_SECRET);
    body.append('scope', 'as_account-us.helium-inc oncalls.read');

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

    let onCallUsers = '';
    json.oncalls.forEach((group) => {
      if (group.schedule && group.schedule.summary === 'EngOps primary') {
        const user = group.user.summary;
        onCallUsers += `**${group.schedule.summary}**: ${user}\n`
      }
      if (group.schedule && group.schedule.summary === 'IoT Comms-ep') {
        const user = group.user.summary;
        onCallUsers += `**${group.schedule.summary}**: ${user}\n`
      }
    });

		return interaction.reply(`${onCallUsers}`);
	},
};
