const { SlashCommandBuilder } = require('discord.js');

const { FOUNDATION_PAGERDUTY_INTEGRATIONS } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foundation-integration')
		.setDescription('Display Foundation PagerDuty email trigger endpoints.'),
	async execute(interaction) {
    const integrationMap = JSON.parse(FOUNDATION_PAGERDUTY_INTEGRATIONS);

    let integrations = '';
    Object.entries(integrationMap).forEach((entry) => {
      const [type, endpoint] = entry;
      integrations += `**${type}**: ${endpoint}\n`
    });

		return interaction.reply(`${integrations}`);
	},
};
