import { SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    name: 'ping',
    
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    
    async execute(interaction: any) {
        interaction.reply("Pong!");
    }
}