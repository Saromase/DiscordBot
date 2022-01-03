const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Account,
} = require('../../collectionInit');

const {
	Devises,
} = require('../../dbObjects');

const {
	configChannel,
	roles,
} = require('../../config.json');


const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
	{
		id: roles.moderator,
		type: 1,
		permission: true,
	},
];

module.exports = {
	permissions : permissions,
	authorizedChan : configChannel.government,
	data: new SlashCommandBuilder()
		.setName('devises')
		.setDescription('Commande sur les monnaies en circulation')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('getall')
				.setDescription('Créer une nouvelle monnaie')
				.addBooleanOption(options => options.setDescription('Affiche les monnaie actives').setName('active').setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Créer une nouvelle monnaie')
				.addStringOption(options => options.setDescription('Nom de la monnaie').setName('name').setRequired(true))
				.addStringOption(options => options.setDescription('Précision (Nombre de chiffre total mini 1)').setName('precision').setRequired(true))
				.addStringOption(options => options.setDescription('Symbole de la monnaie').setName('symbol').setRequired(true))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'create') {
			const symbol = interaction.options.getString('symbol');
			const name = interaction.options.getString('name');
			const precision = interaction.options.getString('precision');
			if (precision < 1) {
				await interaction.reply({
					content: 'La précision doit être minimum de 1',
					ephemeral : true,
				});
				return;
			}

			await Devises.upsert({ name, symbol, precision });
			await interaction.reply({
				content: `La monnaie ${name} à était crée avec le symbole ${symbol}`,
				ephemeral : true,
			});

			const channel = interaction.guild.channels.cache.get(configChannel.government);

			await channel.send({
				content: `Création de la monnaie ${name} ${symbol}. La création d'un compte est désormais possible`,
			});
			console.log(symbol, name);
		}
		else {
			const active = interaction.options.getBoolean('active') ?? true;

			const devises = await Devises.findAll({ where : { active : active } });

			if (devises.length > 0) {

				const embeds = [];
				devises.forEach((d) => {
					const a = require('../../embedded/devises')(d);
					embeds.push(a);
				});
				await interaction.reply({
					embeds: embeds,
					ephemeral : true,
				});
			}
			else {
				await interaction.reply({
					content : `Àucune monnaie ${active ? 'active' : 'désactivé'}`,
					ephemeral : true,
				});
			}
		}

	},
};