const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Currency,
} = require('../../collectionInit');

const { Works } = require('../../dbObjects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('salary')
		.setDescription('Paye tout les salaires.'),
	async execute(interaction) {
		const works = await Works.findAll();
		const payed = [];
		if (works.length > 0) {
			works.forEach(work => {
				const role = interaction.guild.roles.cache.get(work.role_id);
				if (role.members) {
					const members = role.members;
					payed.push(role.name);
					members.forEach((member) => {
						const user = Currency.get(member.id);
						user.balance += work.pay;
						user.save();
					});
				}
			});
		}

		interaction.reply(`Salaires versé à : ${payed.join(', ')}`);
	},
};