const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { category, channel, roles } = require('../../config.json');

const { v4: uuidv4 } = require('uuid');


const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('character')
		.setDescription('Gestion du characters.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Créer un nouveau personnage.')
				.addStringOption(options => options.setName('name').setDescription('Nom de votre personnage'))
				.addStringOption(options => options.setName('firstname').setDescription('Prénom de votre personnage'))
				.addIntegerOption(options => options.setName('age').setDescription('Age de votre personnage')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('dead')
				.setDescription('Déclare la mort d\'un personnage.')),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

	},
};