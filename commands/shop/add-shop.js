const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { category, central_channel, roles } = require('../../config.json');

const { v4: uuidv4 } = require('uuid');

const {
	MessageActionRow,
	MessageButton,
} = require('discord.js');

const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
];

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
		.setName('add-shop')
		.setDescription('Ajoute un nouveau commerce')
		.addStringOption(option => option.setName('name').setDescription('Nom du commerce').setRequired(true))
		.addUserOption(option => option.setName('owner').setDescription('Propriétaire du commerce').setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const user = interaction.options.getUser('owner');

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
		await interaction.reply({
			content: `Confirmer la création du commerce ${name} avec comme propriétaire ${user}`,
			ephemeral : true,
			components : [buttons],
		});

		const buttonfilter = i => i.customId === 'validated' || i.customId === 'refused' && i.user.id === interaction.user.id;
		await interaction.channel.awaitMessageComponent({
			buttonfilter,
			componentType: 'BUTTON',
			time: 60000,
		}).then(async (buttonInteraction) => {
			if (buttonInteraction.customId !== 'validated') {
				await buttonInteraction.reply({
					content: 'Annulation de la création du commerce',
					ephemeral: true,
				});
				return;
			}
			const guild = buttonInteraction.guild;

			const role = await guild.roles.create({
				name : name,
			});
			const categoryChannel = guild.channels.cache.get(category.business);
			await guild.channels.create(name, {
				reason : 'Nouveau commerce ajouté',
				parent : categoryChannel,
			}).then(async (newChan) => {
				const message = `Création du commerce ${newChan} par ${user}`;
				Shops.create({
					id : uuidv4(),
					owner_id: user.id,
					role_id : role.id,
					channel_id: newChan.id,
					name : name,
					deleted : false,
				});
				interaction.guild.members.cache.get(user.id).roles.add(role);
				await buttonInteraction.guild.channels.cache.get(central_channel).send({
					content: message,
				});
				await buttonInteraction.reply({
					content : 'Commerce ajouté',
					ephemeral : true,
				});
			}).catch((error) => {
				console.error(error);
			});
		});
	},
};