import { SlashCommandBuilder } from "@discordjs/builders";
import { sendQOTD, sendCustomQOTD } from "../QOTDManager";

module.exports = {
    data: new SlashCommandBuilder()
            .setName("sendqotd")
            .setDescription("Sends either a random QOTD or a specific custom QOTD. If no QOTD is specified, a random QOTD will be sent.")
            .addStringOption(option => option.setName("qotd").setRequired(false).setDescription("The QOTD to send")),
    
    async execute(interaction: any) {
        const qotd = interaction.options.getString("qotd");
        
        if (qotd) {
            sendCustomQOTD(interaction.client, qotd);
        } else {
            sendQOTD(interaction.client);
            interaction.reply("Sent a random QOTD.", { ephemeral: true });
        }
    }
}