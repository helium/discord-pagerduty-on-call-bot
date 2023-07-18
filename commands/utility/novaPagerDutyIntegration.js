const { SlashCommandBuilder } = require('discord.js');

const { NOVA_PAGERDUTY_INTEGRATIONS } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nova-pd-access')
		.setDescription('Display Nova PagerDuty email trigger endpoints.'),
	async execute(interaction) {
    const integrationMap = JSON.parse(NOVA_PAGERDUTY_INTEGRATIONS);

    let integrations = '';
    Object.entries(integrationMap).forEach((entry) => {
      const [type, endpoint] = entry;
      integrations += `**${type}**: ${endpoint}\n`
    });

		return interaction.reply(`${integrations}`);
	},
};
