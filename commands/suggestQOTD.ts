import { SlashCommandBuilder } from "@discordjs/builders";
import { writeConfig, readConfig } from "../ConfigManager";
import { addQOTD } from "../QOTDManager";

module.exports = {
    name: 'suggestqotd',

    data: new SlashCommandBuilder()
        .setName("suggestqotd")
        .setDescription("Suggests a QOTD to be added to the approval queue")
        .addStringOption(option => option.setName("qotd").setRequired(true).setDescription("The QOTD to suggest")),

    async execute(interaction: any) {
        const qotd = interaction.options.getString("qotd");
        const user = interaction.message.author;
        const approvalMessageId = interaction.message.id;
        interaction.reply("Thanks for your suggestion! I'll let the admins know about it.");
    }
}