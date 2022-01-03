const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Shops,
} = require('../../dbObjects');

const { category, channel, roles } = require('../../config.json');

const { v4: uuidv4 } = require('uuid');

const {
	MessageActionRow,
	MessageButton,
} = require('discord.js');

const permissions = [
	{
		id: roles.admin,
		type: 1,
		permission: true,
	},
];

if (roles.government !== '') {
	permissions.push({
		id: roles.government,
		type: 1,
		permission: true,
	});
}

module.exports = {
	permissions : permissions,
	data: new SlashCommandBuilder()
		.setName('add-shop')
		.setDescription('Ajoute un nouveau commerce')
		.addStringOption(option => option.setName('name').setDescription('Nom du commerce').setRequired(true))
		.addUserOption(option => option.setName('owner').setDescription('Propriétaire du commerce').setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {
		
	},
};