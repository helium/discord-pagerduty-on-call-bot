const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const { NOVA_PAGERDUTY_CLIENT_ID, NOVA_PAGERDUTY_CLIENT_SECRET } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nova-oncall')
		.setDescription('Display active Nova On-Call team members.'),
	async execute(interaction) {
    const tokenBody = new URLSearchParams();
    tokenBody.append('grant_type', 'client_credentials');
    tokenBody.append('client_id', NOVA_PAGERDUTY_CLIENT_ID);
    tokenBody.append('client_secret', NOVA_PAGERDUTY_CLIENT_SECRET);
    tokenBody.append('scope', 'as_account-us.helium-inc oncalls.read');

    const oathRes = await fetch('https://identity.pagerduty.com/oauth/token', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenBody.toString()
    });

    const { access_token } = await oathRes.json();

    const oncallBody = new URLSearchParams();
    oncallBody.append('limit', '50');
    const oncallsRes = await fetch('https://api.pagerduty.com/oncalls?' + oncallBody.toString(), { 
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await oncallsRes.json();
    console.log(json);

    let onCallUsers = '';
    json.oncalls.forEach((group) => {
      if (group.schedule && group.schedule.summary === 'EngOps primary') {
        const user = group.user.summary;
        onCallUsers += `**${group.schedule.summary}**: ${user}\n`
      }
      if (group.schedule && group.schedule.summary === 'IoT Comms') {
        const user = group.user.summary;
        onCallUsers += `**${group.schedule.summary}**: ${user}\n`
      }
    });

    console.log(onCallUsers);
    throw new Error()

		return interaction.reply(`${onCallUsers}`);
	},
};
