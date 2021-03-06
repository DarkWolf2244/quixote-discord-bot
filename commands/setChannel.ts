import { SlashCommandBuilder } from "@discordjs/builders";
import { writeConfig, readConfig } from "../ConfigManager";
import { Interaction, MessageInteraction } from "discord.js";

module.exports = {
    name: 'setchannel',
    
    data: new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Configures the current channel to be something (qotdChannel, suggestionChannel, approvalChannel")
        .addStringOption(option => option.setName("channel").setRequired(true).setDescription("The channel to set the current channel to")),
    
    async execute(interaction: any) {
        if (interaction.member.roles.cache.has("Quixote Controller")) {
            console.log(`Now setting ${interaction.options.getString("channel")}`);
            const channel = interaction.options.getString("channel");
            const config = readConfig();
            
            switch (channel) {
                case "qotdChannel":
                    config.qotdChannel = interaction.channel.id;
                    break;
                case "suggestionChannel":
                    config.suggestionChannel = interaction.channel.id;
                    break;
                case "approvalChannel":
                    config.approvalChannel = interaction.channel.id;
                    break;
                default:
                    interaction.reply("That doesn't seem to be a valid option. Please use a valid channel type.", { ephemeral: true });
            }

            writeConfig(config);
            interaction.reply(`Successfully set the ${channel} to <#${interaction.channel.id}>!`);
        } else {
            interaction.reply("You don't have permission to do that!", { ephemeral: true });
        }
    }
}