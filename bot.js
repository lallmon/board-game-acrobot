const Discord = require("discord.js");
const dotenv = require("dotenv");
const upper = require("lodash.toupper");
const content = require("./acronyms.json");
const http = require("http");
const client = new Discord.Client();
dotenv.config();

stripUserId = str => upper(str.replace(/<\S+>\s/, ""));

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-type": "text/plain"
    });
    res.write("Hey");
    res.end();
  })
  .listen(4000);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on("message", msg => {
  if (msg.author.id === client.user.id) {
    return;
  }
  if (msg.isMentioned(client.user.id)) {
    const command = stripUserId(msg.content);
    if (command === "LIST") {
      msg.channel.send(`You can ask about: ${Object.keys(content)}`);
      return;
    }
    if (content[command]) {
      msg.channel.send(`🤔 ${content[command]}?`);
      return;
    }
    msg.channel.send("💥 Nothin 💥");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
