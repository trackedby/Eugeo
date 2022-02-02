const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (client, message, args, color, langUsing) => {
  if(!message.guild.available) {
    return;
  }
     let chan = 0;
     message.guild.channels.cache.map(channel => {
       if(channel.type === "voice" || channel.type === "text") chan++;
     });

     let cat = 0;
     message.guild.channels.cache.map(channel => {
       if(channel.type === "category") cat++;
     });

     const guildIcon = "https://cdn.discordapp.com/icons/" + message.guild.id + "/" + message.guild.icon + ".webp" || "http://www.royallepagesudbury.ca/images/no-image.png";
     
    const embed = new Discord.MessageEmbed()
    .setColor('#343a40')
    .setAuthor(message.guild.name, guildIcon)
    .setThumbnail(guildIcon)
    .addField("Dono", `${message.guild.owner.user.tag}`, true)
    .addField("Canais", chan, true)
    .addField('Membros', `${message.guild.memberCount - message.guild.members.cache.filter(m=>m.user.bot).size} (${message.guild.members.cache.filter(m=>m.user.bot).size} bots)`, true)
    .addField(`Região`, `${message.guild.region}`, true)
    .addField("Cargos", message.guild.roles.cache.size, true)
    .addField(`Criado em:`, `${moment.utc(message.guild.createdAt).format('DD/MM/YY')}`, true)
    .setTimestamp()
    .setFooter("ID: " + message.guild.id, guildIcon)

    if(!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
      message.channel.send(":x: | Eu preciso da permissão `EMBED_LINKS` para executar este comando.");
      return;
    };

    message.channel.send({embed: embed})
};

module.exports.help = {
  name: 'info'
}
