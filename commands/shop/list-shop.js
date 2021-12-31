const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { roles } = require('../../config.json');

const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
];

if (roles.government !== '') {
	permissions.push({
		id: roles.government,
		type: 1,
		permission: true,
	});
}

module.exports = {
	permissions: permissions,
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