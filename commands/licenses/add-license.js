const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Licenses,
} = require('../../dbObjects');

const {
	LICENSES_TRANSLATION,
} = require('../../utils/LicenseTranslationConstant');

const { USER_TYPE, ROLE_TYPE } = require('../../utils/TargetConstant');


const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
} = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-license')
		.setDescription('Ajoute un permis pour l\'utilisateur !')
		.addMentionableOption(option => option.setName('mention').setDescription('Utilisateur ou Role pour ajouter un permis').setRequired(true)),
	async execute(interaction) {
		const mention = interaction.options.getMentionable('mention');
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('license-type')
					.setPlaceholder('Aucun permis selectionné')
					.addOptions([{
						label: 'Permis de conduire',
						value: 'driver',
					},
					{
						label: 'Permis port d\'arme',
						value: 'weapon',
					},
					{
						label: 'License commerciale',
						value: 'business',
					},
					]),
			);

		await interaction.reply({
			content: 'Sélection du sous permis',
			ephemeral: true,
			components: [row],
		});

		const filter = i => i.customId === 'license-type' && i.user.id === interaction.user.id;
		await interaction.channel.awaitMessageComponent({
			filter,
			componentType: 'SELECT_MENU',
			time: 60000,
		}).then(async (message) => {
			let component;
			const type = message?.values[0];
			switch (type) {
			case 'driver':
				component = [new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('license-subtype')
							.setPlaceholder('Aucun sous type de permis selectionné')
							.addOptions([{
								label: 'Permis Voiture',
								value: 'auto',
							},
							{
								label: 'Permis Camion',
								value: 'truck',
							},
							]),
					),
				];
				break;
			case 'weapon':
				component = [new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('license-subtype')
							.setPlaceholder('Aucun sous type de permis selectionné')
							.addOptions([{
								label: 'Catégorie 1',
								value: 'weapon-1',
							},
							{
								label: 'Catégorie 2',
								value: 'weapon-2',
							},
							{
								label: 'Catégorie 3',
								value: 'weapon-3',
							},
							{
								label: 'Catégorie 4',
								value: 'weapon-4',
							},
							]),
					),
				];
				break;

			case 'business':
				component = [new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('license-subtype')
							.setPlaceholder('Aucun sous type de permis selectionné')
							.addOptions([{
								label: 'Inscription en tant que commerçant',
								value: 'business',
							},
							{
								label: 'Licence IV (alcool)',
								value: 'drunk',
							},
							{
								label: 'Licence Restaurant',
								value: 'food',
							},
							{
								label: 'Licence CBD',
								value: 'weeds',
							},
							]),
					),
				];
				break;

			default:
				component = [];
				break;
			}
			message.reply({
				content: 'Sous type du permis',
				ephemeral: true,
				components: component,
			});

			const subfilter = i => i.customId === 'license-subtype' && i.user.id === interaction.user.id;

			await message.channel.awaitMessageComponent({
				subfilter,
				componentType: 'SELECT_MENU',
				time: 60000,
			}).then(async (submessage) => {
				const subtype = submessage?.values[0];

				const button = new MessageActionRow()
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
				await submessage.reply({
					content: `Confirmer l'ajout d'un permis de ${LICENSES_TRANSLATION[type]} - ${LICENSES_TRANSLATION[subtype]} pour ${mention}`,
					components: [button],
					ephemeral : true,
				});

				const buttonfilter = i => i.customId === 'validated' || i.customId === 'refused' && i.user.id === interaction.user.id;
				await submessage.channel.awaitMessageComponent({
					buttonfilter,
					componentType: 'BUTTON',
					time: 60000,
				}).then(async (buttonInteraction) => {

					if (buttonInteraction.customId === 'validated') {

						const licenses = await Licenses.findAll({
							where: {
								target_id : mention.id,
								type : type,
								subtype : subtype,
							},
						});

						if (licenses.length > 0) {
							await buttonInteraction.reply(`Le permis existe déjà depuis ${licenses[0].date}`);
						}
						else {
							await Licenses.create({
								target_id: mention.id,
								target_type : mention.user ? USER_TYPE : ROLE_TYPE,
								type: type,
								subtype: subtype,
								date: new Date().toJSON(),
							});
							await buttonInteraction.reply({
								content: `Ajout du permis ${LICENSES_TRANSLATION[type]} - ${LICENSES_TRANSLATION[subtype]} pour ${mention} par ${buttonInteraction.user}`,
							});
						}
					}
					else {
						await buttonInteraction.reply({
							content: 'Annulation de l\'ajout du permis',
							ephemeral : true,
						});
					}
				});
			});
		});
	},
};