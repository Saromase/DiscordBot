const {
	SlashCommandBuilder
} = require('@discordjs/builders');

const {
	Shops
} = require('../../dbObjects');

const { v4: uuidv4 } = require('uuid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-shop')
		.setDescription('Créer un nouveau magasin !')
        .addStringOption(option => option.setName('name').setDescription('Nom du shop').setRequired(true))
        .addUserOption(option => option.setName('owner').setDescription('Propriétaire du shop').setRequired(true)),
	async execute(interaction) {
        
	},
};