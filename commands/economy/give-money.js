const {
	SlashCommandBuilder
} = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('give-money')
		.setDescription('Replies the bank of user!'),
	async execute(interaction) {
        await interaction.reply(`Current Balance : ${user.balance}`);
	},
};