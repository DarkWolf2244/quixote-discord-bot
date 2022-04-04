import { SlashCommandBuilder } from "@discordjs/builders";
import { sendQOTD, sendCustomQOTD } from "../QOTDManager";

module.exports = {
    name: 'sendqotd',
    data: new SlashCommandBuilder()
            .setName("sendqotd")
            .setDescription("Send a custom or random QOTD right now.")
            .addStringOption(option => option.setName("qotd").setRequired(false).setDescription("The QOTD to send")),
    
    async execute(interaction: any) {
            if (interaction.member.roles.cache.find(role => role.name === 'Quixote Controller')) {
            const qotd = interaction.options.getString("qotd");
            
            if (qotd) {
                sendCustomQOTD(interaction.client, qotd);
            } else {
                sendQOTD(interaction.client);
                interaction.reply("Sent a random QOTD.", { ephemeral: true });
            }
        }
    }
}