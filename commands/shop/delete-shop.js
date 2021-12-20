const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { roles, channel } = require('../../config.json');


const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
} = require('discord.js');

const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
];

Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
	shops.forEach((shop) => {
		permissions.push({
			id : shop.role_id,
			type : 1,
			permission : true,
		});
	});
});

if (roles.city !== '') {
	permissions.push({
		id: roles.city,
		type: 1,
		permission: true,
	});
}

module.exports = {
	permissions : permissions,
	data: new SlashCommandBuilder()
		.setName('delete-shop')
		.setDescription('Ajoute un nouveau commerce')
		.setDefaultPermission(false),
	async execute(interaction) {
		const user = interaction.user;
		const listOptions = [];
		await Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
			shops.forEach((shop) => {
				listOptions.push({
					value : shop.id,
					label : shop.name,
				});
			});
		});

		console.log(listOptions);
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

			const shop = await Shops.findOne({ where:{ id : message?.values[0] } });
			// console.log(user.roles);
			// if (shop.owner_id !== user.id || user.roles.has()) {
			// }
			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('validated')
						.setLabel('Confirmer')
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId('refused')
						.setLabel('Annuler')
						.setStyle('DANGER'),
				);
			await message.reply({
				content: `Confirmer la suppression du commerce "${shop.name}" (<@&${shop.role_id}>) avec comme propriétaire <@${shop.owner_id}>`,
				ephemeral : true,
				components : [buttons],
			});

			const buttonfilter = i => i.customId === 'validated' || i.customId === 'refused' && i.user.id === interaction.user.id;
			await message.channel.awaitMessageComponent({
				buttonfilter,
				componentType: 'BUTTON',
				time: 60000,
			}).then(async (buttonInteraction) => {
				if (buttonInteraction.customId !== 'validated') {
					await buttonInteraction.reply({
						content: 'Annulation de la supression du commerce',
						ephemeral: true,
					});
					return;
				}
				try {

					await Shops.update({
						deleted : 1,
					}, {
						where : {
							id : shop.id,
						},
					});
					const fetchedChannel = interaction.guild.channels.cache.get(shop.channel_id);
					fetchedChannel.delete();

					const fetchedRole = interaction.guild.roles.cache.get(shop.role_id);
					fetchedRole.delete();

					await buttonInteraction.guild.channels.cache.get(channel.central).send({
						content: `Fermeture du commerce "${shop.name}" tenu par <@${shop.owner_id}> `,
					});

					await buttonInteraction.reply({
						content : 'Commerce supprimé',
						ephemeral : true,
					});
				}
				catch (error) {
					console.error(error);
					await buttonInteraction.reply({
						content : 'Erreur lors de la suppression du commerce.',
						ephemeral : true,
					});
				}

			});

		});

	},
};