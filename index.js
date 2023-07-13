const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
  console.log(`Logged in...`);
});

client.on('message', msg => {
  if (msg.content.indexOf("ping") === 0) { 
    msg.reply('pong');
  }
});

client.login(process.env.DISCORD_TOKEN);
