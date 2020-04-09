const axios = require('axios');
const Discord = require("discord.js");
const dotenv = require("dotenv");
const last = require('lodash/last');
const replace = require('lodash/replace');
const split = require('lodash/split');
const trim = require('lodash/trim');

const client = new Discord.Client();
dotenv.config();

const suggestion = new Discord.MessageEmbed()
			      .setColor('blue')
			      .setURL('https://forms.gle/pGrDA4miGey162aa9')
			      .setTitle('Suggest Acronyms Here');


client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on("message", msg => {
  if (msg.author.id === client.user.id) {
    //Don't respond to yourself, lol.
    return;
  }

  if (msg.mentions.users.has(client.user.id)) {
    //Reduce to just the capital letter acronym			     
    const command = replace(trim(last(split(msg.content, '>'))), /[^\w\s]/gi, '').toUpperCase();

    if (command === "HELP") {
      msg.channel.startTyping();
      axios
	.get(`${process.env.ACRONYM_API_URL}.json`)
	.then(res => {
	  msg.channel.send(`I know about: ${Object.keys(res.data)}`);
	})
	.catch(err => {
	  console.error(err.message);
	})
	.finally(() => {
	  msg.channel.stopTyping();
	})
    } else {
      msg.channel.startTyping();
      axios
	.get(`${process.env.ACRONYM_API_URL}/${command}.json`)
	.then(res => {
	  if (res.data === null) {
	    msg.channel.send("💥 Nothin.");
	    msg.channel.send(suggestion);
	    return
	  }
	    msg.channel.send(`🤔 ${res.data}?`);
	 })
	 .catch(err => {
	   console.error(err.message);
	 })
	.finally(() => {
	  msg.channel.stopTyping();
	})
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
