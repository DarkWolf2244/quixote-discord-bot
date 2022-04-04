import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMemberRoleManager, Interaction, MessageEmbed } from "discord.js";
import e from "express";

let qotds = require('../qotd.json');

module.exports = {
    name: 'viewqueue',
    data: new SlashCommandBuilder()
            .setName("viewqueue")
            .setDescription("Views the approved queue"),
        
    async execute(interaction: CommandInteraction) {
        // Check if the user has a role called 'Quixote Controller'
        let memberRoleManager: any = interaction.member.roles;
        let roleManager: GuildMemberRoleManager = memberRoleManager; // Yes, this is a hack.

        if (roleManager.cache.some(role => role.name === 'Quixote Controller')) {

            let approvedQOTDs = qotds.approvedQOTDs;
            let embedData = {
                title: "Approved QOTDs",
                description: "",
                fields: []
            }

            for (let qotd of approvedQOTDs) {
                embedData.fields.push({
                    name: qotd.content,
                    value: `<@${qotd.user}>`
                });
            }

            let embed = new MessageEmbed(embedData);
            embed.setColor("GREEN");

            interaction.reply({ embeds: [ embed ] });
        } else {
            interaction.reply("You don't have permission to do that, mate.");
        }
    }
}