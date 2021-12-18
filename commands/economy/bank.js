const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Account,
} = require('../../collectionInit');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bank')
		.setDescription('Retourne le compte de l\'utilisateur!')
		.addRoleOption(option => option.setName('role').setDescription('Role')),
	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const target = role ?? interaction.user;

		const account = Account.get(target.id);

		if (account) {
			const embed = require('../../embedded/account')(account.balance);
			await interaction.reply({
				embeds: [embed],
				ephemeral : true,
			});
			return;
		}

		await interaction.reply({ content : `Aucun compte associé à ${target}`, ephemeral : true });
		return;
	},
};