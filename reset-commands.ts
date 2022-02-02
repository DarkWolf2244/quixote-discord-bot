const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

import { Client, Intents } from "discord.js";

const token = process.env.DISTOKEN;
const guildId = config.guildId;
const clientId = config.clientId;
    
const rest = new REST({ version: '9' }).setToken(token);
// rest.get(Routes.applicationGuildCommands(clientId, guildId))
//     .then(data => {
//         const promises = [];
//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
//             promises.push(rest.delete(deleteUrl));
//         }
//         return Promise.all(promises);
// });

let client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
    let guild = client.guilds.cache.get(guildId);
    guild.commands.cache.find(c => c.name === 'suggest').delete()
    guild.commands.cache.find(c => c.name === 'ping').delete()
});

