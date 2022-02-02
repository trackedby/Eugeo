const Discord = require('discord.js');

module.exports.run = async (client, message, args, color, langUsing) => {

  let language = require(`../messages/messages_${langUsing}.json`);

  let pingMessage = language["ping"].ping;
  const ping = pingMessage.replace("${ping}", Math.round(client.ws.ping));

  message.channel.send(`${ping}`);
};

module.exports.help = {
  name: 'ping'
}
