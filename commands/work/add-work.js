const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Currency,
} = require('../../collectionInit');

const {
	Works,
} = require('../../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-work')
		.setDescription('Add new work from roles')
		.addRoleOption(option => option.setName('role').setDescription('Role of work').setRequired(true))
		.addIntegerOption(option => option.setName('pay').setDescription('Pay every week').setRequired(true)),
	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const pay = interaction.options.getInteger('pay');
		let oldWork = await Works.findAll({
			where: {
				role_id: role.id,
			},
		});


		let message = '';
		if (oldWork && oldWork[0]) {
			oldWork = oldWork[0];
			message = `Update work "${role.name}" with a pay change from ${oldWork.pay} $ at ${pay} $`;
			oldWork.pay = pay;
			oldWork.name = role.name;
			oldWork.save();
		}
		else {
			message = `Add new work "${role.name}" with a pay at ${pay} $`;
			await Works.create({
				role_id: role.id,
				name: role.name,
				pay: pay,
			});
		}
		interaction.reply({
			content: message,
			ephemeral: true,
		});
	},
};