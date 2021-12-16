const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-shop')
		.setDescription('Liste l\'ensemble des magasins .'),
	async execute(interaction) {
		const shops = await Shops.findAll();

		if (shops.length > 0) {
			const embed = require('../../embedded/list-shop')(interaction, shops);
			await interaction.reply({
				embeds : [embed],
			});
		}
		else {
			await interaction.reply('Aucun magasin n\'est actuellement enregistrer');
		}

	},
};