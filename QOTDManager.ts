import * as fs from 'fs';
import { ButtonInteraction, CommandInteraction, GuildMember, MessageEmbed, MessageEmbedOptions, User, Message } from 'discord.js';
import { readConfig, writeConfig } from './ConfigManager';
import { Client } from 'discord.js';
import { QOTDFileInterface, QOTDInterface } from './interfaces';

let qotds: QOTDFileInterface = require('./qotd.json');

export function addQOTD(qotd: string, user: any, approvalMessageId: string) {
    qotds.suggestions.push({
        userID: user.id,
        content: qotd,
        approvalMessageId: approvalMessageId
    });

    fs.writeFileSync('./qotd.json', JSON.stringify(qotds, null, 4));
}

export function approveQOTD(interaction: ButtonInteraction, waitingOnQOTD: boolean) {
    qotds.suggestions.forEach((qotd, index) => {
        if (qotd.approvalMessageId === interaction.message.id) {
            qotds.approvedQOTDs.push(qotd);
            qotds.suggestions.splice(index, 1);
            
            let originalEmbed = interaction.message.embeds[0];
            let editedEmbed = {
                title: originalEmbed.title,
                description: originalEmbed.description,
                fields: originalEmbed.fields,
                footer: {
                    text: `Approved by ${interaction.user.username}#${interaction.user.discriminator}`
                }
            }

            let readyEmbed = new MessageEmbed(editedEmbed);

            readyEmbed.setColor("GREEN");
            
            let interactionMessage: any = interaction.message;
            let actualMessage: Message = interactionMessage;
            interaction.message = actualMessage; // Aaaaaah

            interaction.message.edit({ embeds: [readyEmbed] });
            interaction.reply({ content: "QOTD approved!", ephemeral: true });
        }
    });

    fs.writeFileSync('./qotd.json', JSON.stringify(qotds, null, 4));

    if (waitingOnQOTD) sendQOTD(interaction.client);
}

export function rejectQOTD(interaction: ButtonInteraction) {
    // TODO DM the user that their QOTD was rejected
    // Delete the QOTD suggestion
    qotds.suggestions.forEach((qotd, index) => {
        if (qotd.approvalMessageId === interaction.message.id) {
            qotds.suggestions.splice(index, 1);
            // interaction.client.users.fetch(qotd.userID).then(user => {
            //     user.dmChannel.send("Your QOTD suggestion has been rejected. Please contact the mods for more info.");
            // });
        }
    });

    let originalEmbed = interaction.message.embeds[0];
    let editedEmbed = {
        title: originalEmbed.title,
        description: originalEmbed.description,
        fields: originalEmbed.fields,
        footer: {
            text: `Rejected by ${interaction.user.username}#${interaction.user.discriminator}`
        }
    }

    let readyEmbed = new MessageEmbed(editedEmbed);

    readyEmbed.setColor("RED");

    fs.writeFileSync('./qotd.json', JSON.stringify(qotds, null, 4));

    let interactionMessage: any = interaction.message;
    let actualMessage: Message = interactionMessage;
    interaction.message = actualMessage; // Aaaaaah again

    interaction.message.edit({ embeds: [readyEmbed] });
    interaction.reply( { content: "QOTD rejected!", ephemeral: true } );
    
}

export function sendQOTD(client: Client<boolean>): boolean {
    if (qotds.approvedQOTDs.length > 0) {
        let randomQOTD = qotds.approvedQOTDs[Math.floor(Math.random() * qotds.approvedQOTDs.length)];

        let qotdEmbed: MessageEmbedOptions = {
            title: "Question of the Day",
            description: randomQOTD.content
        }

        let readyEmbed = new MessageEmbed(qotdEmbed);

        readyEmbed.setColor("BLUE");

        client.channels.fetch(readConfig().qotdChannel).then((channel: any) => {
            channel.send({ embeds: [readyEmbed] });
        });

        // Remove the QOTD from the approved list
        qotds.approvedQOTDs.forEach((qotd, index) => {
            if (qotd.content === randomQOTD.content) {
                qotds.approvedQOTDs.splice(index, 1);
                return;
            }
        });

        fs.writeFileSync('./qotd.json', JSON.stringify(qotds, null, 4));

        return false; // We aren't waiting for a QOTD

    } else {
        client.channels.fetch(readConfig().qotdChannel).then((channel: any) => {
            let embed = new MessageEmbed({
                title: "Question of the Day",
                description: "No QOTDs available :( Suggest some!",
                color: "RED"
            });

            channel.send({ embeds: [embed] });
        });

        return true; // We are waiting for a QOTD
    }
}

export function sendCustomQOTD(client: Client, qotd: string) {
    let qotdEmbed: MessageEmbedOptions = {
        title: "Question of the Day",
        description: qotd
    }

    let readyEmbed = new MessageEmbed(qotdEmbed);

    readyEmbed.setColor("BLUE");

    client.channels.fetch(readConfig().qotdChannel).then((channel: any) => {
        channel.send({ embeds: [readyEmbed] });
    });
}
