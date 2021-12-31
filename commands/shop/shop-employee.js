const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { roles } = require('../../config.json');

const {
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js');

const {
	Employees,
} = require('../../dbObjects');


const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
];

Shops.findAll({ where : { deleted : 0 } }).then((shops) => {
	shops.forEach((shop) => {
		permissions.push({
			id : shop.role_id,
			type : 1,
			permission : true,
		});
	});
});

if (roles.government !== '') {
	permissions.push({
		id: roles.government,
		type: 1,
		permission: true,
	});
}

module.exports = {
	permissions: permissions,
	data: new SlashCommandBuilder()
		.setName('shop-employee')
		.setDescription('Commande interne pour les commerces.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('hire')
				.setDescription('Embaucher l\'utilisateur comme employé.')
				.addUserOption(options => options.setName('user').setDescription('Utilisateur à ajouter').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('fire')
				.setDescription('Virer l\'utilisateur.')
				.addUserOption(options => options.setName('user').setDescription('Utilisateur à ajouter').setRequired(true))),
	async execute(interaction) {
		const owner = interaction.user;
		const user = interaction.options.getUser('user');
		const listOptions = [];
		await Shops.findAll({ where : { deleted : 0, owner_id : owner.id } }).then((shops) => {
			shops.forEach((shop) => {
				listOptions.push({
					value : shop.id,
					label : shop.name,
				});
			});
		});

		if (listOptions.length === 0) {
			await interaction.reply({
				content: 'Vous n\'avez aucun commerce.',
				ephemeral: true,
			});

			return;
		}

		const subcommand = interaction.options.getSubcommand();

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('shop')
					.setPlaceholder('Aucun commerce sélectionné')
					.addOptions(listOptions),
			);

		await interaction.reply({
			content: 'Selection du commerce ou l\'employer sera ajouté.',
			ephemeral: true,
			components: [row],
		});

		const filter = i => i.customId === 'shop' && i.user.id === interaction.user.id;
		await interaction.channel.awaitMessageComponent({
			filter,
			componentType: 'SELECT_MENU',
			time: 60000,
		}).then(async (message) => {
			const selectedShop = await Shops.findOne({ where: { id : message?.values[0] } });
			const shopEmployees = await selectedShop.getEmployees();
			console.log(shopEmployees);
			const isCurrentEmployee = shopEmployees.filter(employee => employee.user_id === user.id);

			console.log(subcommand);
			console.log(isCurrentEmployee.id);
			console.log(user);

			if (isCurrentEmployee.length === 0 && subcommand === 'hire') {
				const employee = await Employees.create({ user_id : user.id });
				await selectedShop.setEmployees(employee);
				await message.reply({
					content : `Vous avez ajouté ${user} au commerce ${selectedShop.name}`,
					ephemeral : true,
				});
				await message.guild.channels.cache.get(selectedShop.channel_id).send({
					content : `Le commerce vient d'embaucher ${user} ! Souhaitons lui la bienvenue.`,
					ephemeral : true,
				});
			}
			else if (isCurrentEmployee.length === 1 && subcommand === 'fire') {
				// const employee = await Employees.create({ user_id : user.id });
				// await selectedShop.setEmployees(employee);
				await message.reply({
					content : `Vous avez viré ${user} du commerce ${selectedShop.name}`,
					ephemeral : true,
				});
				await message.guild.channels.cache.get(selectedShop.channel_id).send({
					content : `Le commerce vient de virer ${user} ! Souhaitons lui bonne route !.`,
					ephemeral : true,
				});
			}
			else {
				await message.reply({
					content : 'L\'employé est déjà embaucher.',
					ephemeral : true,
				});
			}

		});
	},
};