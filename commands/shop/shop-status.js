const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { roles } = require('../../config.json');

const {
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');

const { channel } = require('../../config.json');


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
		.setName('shop')
		.setDescription('Commande interne pour les commerces.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('open')
				.setDescription('Ouvrir le commerce.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('close')
				.setDescription('Ferme le commerce.')),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand() === 'open';
		const listOptions = [];
		await Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
			shops.forEach((shop) => {
				listOptions.push({
					value : shop.id,
					label : shop.name,
				});
			});
		});

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('shop')
					.setPlaceholder('Aucun commerce sélectionné')
					.addOptions(listOptions),
			);

		await interaction.reply({
			content: 'Selection du commerce à supprimer.',
			ephemeral: true,
			components: [row],
		});

		const filter = i => i.customId === 'shop' && i.user.id === interaction.user.id;
		await interaction.channel.awaitMessageComponent({
			filter,
			componentType: 'SELECT_MENU',
			time: 60000,
		}).then(async (message) => {
			const selectedShop = await Shops.findOne({ where: { id : message?.values[0] } });
			const associatedRole = message.guild.roles.cache.get(selectedShop.role_id);

			const embed = require('../../embedded/shop-status')(interaction.user, associatedRole, subcommand);

			await message.guild.channels.cache.get(channel.openShop).send({
				embeds : [embed],
			});
			await message.reply({
				content : 'Ouverture du commerce',
				ephemeral : true,
			});
		});
	},
};