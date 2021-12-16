const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { v4: uuidv4 } = require('uuid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-shop')
		.setDescription('Créer un nouveau magasin !')
		.addStringOption(option => option.setName('name').setDescription('Nom du shop').setRequired(true))
		.addUserOption(option => option.setName('owner').setDescription('Propriétaire du shop').setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const owner = interaction.options.getUser('owner');

		await Shops.create({
			id : uuidv4(),
			user_id: owner.id,
			name: name,
		});

	},
};