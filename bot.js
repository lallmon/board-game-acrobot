const axios = require('axios');
const Discord = require("discord.js");
const dotenv = require("dotenv");
const split = require('lodash/split');
const last = require('lodash/last');
const trim = require('lodash/trim');
const client = new Discord.Client();
dotenv.config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on("message", msg => {
  if (msg.author.id === client.user.id) {
    //Don't respond to yourself, lol.
    return;
  }
  console.log(msg.mentions.users[client.user.id]);
  if (msg.mentions.users.has(client.user.id)) {
    //Only respond to text after the @			     
    const command = trim(last(split(msg.content, '>'))).toUpperCase();

    if (command === "HELP") {
      axios.get(`${process.env.ACRONYM_API_URL}.json`)
	   .then(res => {
	     msg.channel.send(`I know about: ${Object.keys(res.data)}`);
	   })
	   .catch(err => (
	     console.error(err.message)
	   ));
    } else {  
      axios.get(`${process.env.ACRONYM_API_URL}/${command}.json`)
	   .then(res => {
	     res.data === null ?
	     msg.channel.send("💥 Nothin. Ask me HELP for more") :
	     msg.channel.send(`🤔 ${res.data}?`);
	   })
	   .catch(err => {
	     console.error(err.message)
	   })
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
