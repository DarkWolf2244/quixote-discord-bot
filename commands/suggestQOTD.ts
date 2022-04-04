import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
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
        const user = interaction.user;

        let approvalChannel = interaction.client.channels.cache.get(readConfig().approvalChannel);

        if (!approvalChannel) {
            interaction.reply("Turns out the approval channel hasn't been set yet. Yell at CHT64 to set one.");
        } else {
            // Create an embed with all the info
            let embedData = {
                title: "QOTD Suggestion",
                description: `Hey mods, here's a brand new QOTD suggested by <@${interaction.user.id}>. What do you think?`,
                fields: [
                    { name: "QOTD", value: qotd},
                    { name: "Suggested By", value: `<@${interaction.user.id}>`}
                ],
                footer: {
                    text: "Choose Approve or Reject. (Ban option coming soon)"
                }
            }

            let embed = new MessageEmbed(embedData);

            embed.setColor("GOLD");

            let buttonRow = new MessageActionRow();

            buttonRow.addComponents(
                new MessageButton()
                    .setCustomId("approve")
                    .setLabel("Approve")
                    .setStyle('SUCCESS'),
                
                new MessageButton()
                    .setCustomId("reject")
                    .setLabel("Reject")
                    .setStyle('DANGER')
            )

            let sentMessage = await approvalChannel.send({ embeds: [embed], components: [buttonRow] });

            addQOTD(qotd, user, sentMessage.id);
            interaction.reply({ content: "Okay, suggestion recorded.", ephemeral: true });
        }
    }
}