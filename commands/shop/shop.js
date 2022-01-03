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
		.setName('shop')
		.setDescription('Commande interne pour les commerces.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('open')
				.setDescription('Ouvrir le commerce.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('close')
				.setDescription('Ferme le commerce.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Créer un nouveau commerce (Membre du gouvernement uniquement).')),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'open' || subcommand === 'close') {
			const listOptions = [];
			await Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
				shops.forEach((shop) => {
					listOptions.push({
						value : shop.id,
						label : shop.name,
					});
				});
			});

			if (listOptions.length === 0) {
				await interaction.reply({
					content : 'Vous ne posséder ou n\'ếtes employé dans aucun commerce',
					ephemeral : true,
				});
				return;
			}

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
				const selectedShop = await Shops.findOne({ where: { id : message?.values[0] } });
				const associatedRole = message.guild.roles.cache.get(selectedShop.role_id);

				const embed = require('../../embedded/shop-status')(interaction.user, associatedRole, subcommand === 'open');

				await message.guild.channels.cache.get(channel.openShop).send({
					embeds : [embed],
				});
				await message.reply({
					content : 'Ouverture du commerce',
					ephemeral : true,
				});
			});
		}
		else if (subcommand === 'create') {
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
					await buttonInteraction.guild.channels.cache.get(channel.central).send({
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
		}
	},
};