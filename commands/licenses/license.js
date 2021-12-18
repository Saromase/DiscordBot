const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Licenses,
} = require('../../dbObjects');

const {
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('license')
		.setDescription('Vérifie si l\'utilisateur ou le commerce à une license')
		.addMentionableOption(option => option.setName('mention').setDescription('Utilisateur ou Role pour vérifier un permis').setRequired(true)),
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
				const where = {
					target_id: mention.id,
					type : type,
					subtype : submessage?.values[0],
				};

				const license = await Licenses.findAll({
					where: where,
				});


				if (license && license[0]) {
					await submessage.reply({ content : `L'utilisateur ou le commerce à ce permis depuis le ${license[0].date}`, ephemeral : true });
				}
				else {
					await submessage.reply({ content : 'L\'utilisateur ou le commerce n\'a pas ce permis.', ephemeral : true });
				}
			});
		});
	},
};