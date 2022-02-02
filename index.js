 
global.Discord = require('discord.js')
const Discord = require('discord.js');
const keep_alive = require('./keep_alive.js')
const fs = require('fs');
const moment = require('moment');

const client = new Discord.Client();
const config = require("./Storage/config.json");
const prefixgen = config.prefix;
const version = config.version;
const color = config.color;
const langUsed = config.lang;
const { createWriteStream } = require("fs");
const { execSync } = require("child_process");

client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log(new Error("[Eugeo] Ocorreu um erro ao carregar os comandos do sistema principal."));
    process.exit(1);
    return;
  }

  jsfile.forEach((f) =>{
    let props = require(`./commands/${f}`);
    console.log(`[Eugeo] Carregado ${f}.`);
    client.commands.set(props.help.name, props);
  });
})

/* ########################################################## */
/*                                                            */
/*               CLIENT ON VOICE JOIN DETTECT                 */
/*                                                            */
/* ########################################################## */

client.on('voiceStateUpdate', (oldState, newState) => {
  if(newState.channelID === null) //left
      console.log('user left channel', oldState.channelID);
  else if(oldState.channelID === null) // joined

      console.log('user joined channel', newState.channelID);

      let voiceChannel = client.channels.cache.get('915748288727248931');
      voiceChannel
    .join()
    .then((connection) => {
        const dispatcher = connection.play("./audios/audio.mp3");

        dispatcher.on("speaking", (speaking) => {
            if (!speaking) {
                voiceChannel.leave();
            }
        });
    })
});

/* ########################################################## */
/*                                                            */
/*      CLIENT LOGING (do not modify anything in here)        */
/*                                                            */
/* ########################################################## */


client.login(config.token);


/* ########################################################## */
/*                                                            */
/*      CLIENT EVENTS (do not modify anything in here)        */
/*                                                            */
/* ########################################################## */

// error notifiers

client.on("error", (e) => {
  console.error(e);
});

client.on("warn", (e) => {
  console.warn(e);
});

process.on('unhandledRejection', error => {
  console.error(`Erro: \n${error.stack}`);
});

// client ready event1

client.on('ready', () => {
	
// activity

  client.user.setActivity(`🔊 cuidando dos canais de voz`, { type: 'WATCHING' });
});

setInterval(() => {
  console.log(`[Eugeo] Ping: ${Math.round(client.ws.ping)}`);
}, 30000);

// client message event

client.on("message", (message) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let argresult = args.join(" ");

  // custom prefixes
  let prefixes = JSON.parse(fs.readFileSync("./Storage/prefixes.json", "utf8"));
  if(!prefixes[message.guild.id] || prefixes[message.guild.id] === undefined) {
    prefixes[message.guild.id] = {
      prefixes: "+"
    };
    fs.writeFile("./Storage/prefixes.json", JSON.stringify(prefixes, null, 2), (err) => {
      if (err) console.log(err)
    });
  };

  let prefix = prefixes[message.guild.id].prefixes;

  if(!message.content.startsWith(prefix)) return;

  // command hanler

  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(client,message,args,color,langUsing);

});
