const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Works,
} = require('../../dbObjects');

const { category } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-work')
		.setDescription('Add new work from roles')
		.addStringOption(option => option.setName('name').setDescription('Nom du métier').setRequired(true))
		.addIntegerOption(option => option.setName('pay').setDescription('Pay every week').setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const pay = interaction.options.getInteger('pay');

		const guild = interaction.guild;

		const role = await guild.roles.create({
			name : name,
		});
		const categoryChannel = guild.channels.cache.get(category.work);
		await guild.channels.create(name, {
			reason : 'Nouveaux métier ajouté',
			parent : categoryChannel,
		}).then((channel) => {
			console.log(channel.id);
			const message = `Le ${role} à bien était créer, le channel ${channel} associé aussi.`;
			Works.create({
				role_id: role.id,
				channel_id: channel.id,
				pay: pay,
			});
			interaction.reply({
				content: message,
				ephemeral: true,
			});
		}).catch((error) => {
			console.error(error);
		});

	},
};