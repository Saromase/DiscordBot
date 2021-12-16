const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Licenses,
} = require('../../dbObjects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('license')
		.setDescription('Check License for user!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('License type')
				.setRequired(true)
				.addChoice('Permis de conduire', 'driver')
				.addChoice('Port d\'arme', 'weapon')
				.addChoice('Commerce', 'buziness'))
		.addUserOption(option => option.setName('user').setDescription('User to check').setRequired(true))
		.addStringOption(option => option.setName('subtype').setDescription('License subtype').setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		const where = {
			user_id: user.id,
		};

		const type = interaction.options.getString('type');

		if (type) {
			where.type = type;
		}

		const subtype = interaction.options.getString('subtype');
		if (subtype) {
			where.subtype = subtype;
		}

		const license = await Licenses.findAll({
			where: where,
		});


		if (license && license[0]) {
			await interaction.reply(`User has this license since ${license[0].date}`);
		}
		else {
			await interaction.reply('User doesnt has this license');
		}
	},
};