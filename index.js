var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var discordToken = process.env.discordToken;
var fs = require('fs');
var client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', function () {
    console.log("Quixote is up and running!");
});
client.on('message', function(msg) {
	msg.reply("Hi!")
});
client.login(discordToken);
