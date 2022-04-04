import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

let qotds = require('../qotd.json');

module.exports = {
    name: 'viewqueue',
    data: new SlashCommandBuilder()
            .setName("viewqueue")
            .setDescription("Views the approved queue"),
        
    async execute(interaction: any) {
        let approvedQOTDs = qotds.filter(qotd => qotd.approved);
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

        interaction.reply({ embeds: embed});
    }
}