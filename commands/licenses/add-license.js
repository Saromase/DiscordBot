const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Licenses,
} = require('../../dbObjects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-license')
		.setDescription('Ajoute un permis pour l\'utilisateur !')
		.addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('License type')
				.setRequired(true)
				.addChoice('Permis de conduire', 'driver')
				.addChoice('Port d\'arme', 'weapon')
				.addChoice('Commerce', 'buziness'))
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

		const licenses = await Licenses.findAll({
			where: where,
		});

		if (licenses.length > 0) {
			await interaction.reply(`User already has this license since ${licenses[0].date}`);
		}
		else {
			await Licenses.create({
				user_id: user.id,
				type: type,
				subtype: subtype ?? null,
				date: new Date().toJSON(),
			});

			await interaction.reply(`Add ${type} ${subtype ?? ''} license to ${user}`);
		}
	},
};