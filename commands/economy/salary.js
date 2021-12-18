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
		.setDescription('Paye un salaire précisément, ou l\'ensemble des salaires.')
		.addRoleOption(options => options.setDescription('Role à payer').setName('role')),
	async execute(interaction) {
		const mentionRole = interaction.options.getRole('role');
		let works;
		if (mentionRole) {
			works = await Works.findOne({ where : { role_id : mentionRole.id } });
		}
		else {
			works = await Works.findAll();
		}
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