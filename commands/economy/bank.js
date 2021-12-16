const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Currency,
} = require('../../collectionInit');

const {
	Users,
} = require('../../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bank')
		.setDescription('Retourne le compte de l\'utilisateur!'),
	async execute(interaction) {
		const userId = interaction.user.id;
		const user = Currency.get(userId);

		if (user) {
			const embed = require('../../embedded/account')(user.balance);
			await interaction.reply({
				embeds: [embed],
			});
			return;
		}

		const newUser = await Users.create({
			user_id: userId,
			balance: 0,
		});
		Currency.set(userId, newUser);
		const embed = require('../../embedded/account')(newUser.balance, true);
		await interaction.reply({
			embeds: [embed],
		});
		return;
	},
};