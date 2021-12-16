const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Currency,
} = require('../../collectionInit');

const {
	Users,
} = require('../../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('offer-hire')
		.setDescription('Poste une offre d\'emploi')
		.addSubcommand(subcommand =>
			subcommand
				.setName('hire')
				.setDescription('Poster une offre d\'emploi'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Retirer une offre d\'emploi')),
	async execute(interaction) {

		// interaction.option.getSub
		// Create a new role with data and a reason
		// interaction.guild.roles.create({
		//         name: 'Commerce',
		//         color: 'DARK_GREEN',
		//         reason: 'we needed a role for Super Cool People',
		//     })
		//     .then(console.log)
		//     .catch(console.error);
	},
};