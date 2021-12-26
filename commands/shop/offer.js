const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('offer')
		.setDescription('Gestion des offres d\'emplois')
		.addSubcommand(subcommand =>
			subcommand
				.setName('hire')
				.setDescription('Poster une offre d\'emploi')
				.addStringOption(option => option.setName('description').setDescription('Description du poste')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('hired')
				.setDescription('Déclarer une offre pourvu'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('cancel')
				.setDescription('Retirer une offre d\'emploi')),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		const listOptions = [];
		await Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
			shops.forEach((shop) => {
				listOptions.push({
					value : shop.id,
					label : shop.name,
				});
			});
		});

		if (subcommand === 'hire') {

		}
		else if (subcommand === 'hired') {

		}
		else if (subcommand === 'cancel') {

		}
	},
};