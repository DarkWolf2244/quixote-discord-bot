import { CacheType, Interaction, Client, Collection, Intents } from 'discord.js';
import { approveQOTD, rejectQOTD, sendQOTD } from './QOTDManager';
import * as node_schedule from 'node-schedule';

import * as fs from 'fs';

import express from 'express';

let waitingOnQOTD = false;

let client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

let commands = new Collection();

// Load all commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    console.log(`Loaded command ${command.name}`);
}

client.once('ready', () => {
    console.log("Quixote is up and running!");
});

client.on('interactionCreate',  async (interaction) => {
    if (interaction.isCommand()) {
        const command: any = commands.get(interaction.commandName);
        if (!command) return interaction.reply("Unknown command!");

        try {
            await command.execute(interaction);
        } catch (error) {
            interaction.reply(`An error occured while executing this command. Lemme call @DarkWolf#8595.`);
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'approve') {
            approveQOTD(interaction, waitingOnQOTD);

            if (waitingOnQOTD) {
                waitingOnQOTD = false;
            }

        } else if (interaction.customId == "reject") {
            rejectQOTD(interaction);
        }
    }
});

client.login(process.env.DISTOKEN);

let app = express();

app.get("/", (req, res) => {
    res.send("Quixote is running.");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Express server is online.");
});

node_schedule.scheduleJob('0 0 * * *', () => {
    waitingOnQOTD = sendQOTD(client);
});

setInterval(() => { waitingOnQOTD = sendQOTD(client); }, 10000);


// TODO Implement createQOTD command
// TODO Implement sendQOTD command