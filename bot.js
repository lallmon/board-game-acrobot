const Discord = require("discord.js");
const dotenv = require("dotenv");
const split = require('lodash/split');
const last = require('lodash/last');
const trim = require('lodash/trim');
const content = require("./acronyms.json");
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
      msg.channel.send(`I know about: ${Object.keys(content)}`);
      return;
    }
    if (content[command]) {
      msg.channel.send(`🤔 ${content[command]}?`);
      return;
    }
    
    msg.channel.send("💥 Nothin. Ask me HELP for more");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
