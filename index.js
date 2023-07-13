const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(message);
  if (msg.content.indexOf("ping") === 0) { 
    msg.reply('pong');
  }
});

client.login(process.env.DISCORD_TOKEN);
