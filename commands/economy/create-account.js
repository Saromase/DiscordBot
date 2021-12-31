const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Account,
} = require('../../collectionInit');


const {
	Accounts,
} = require('../../dbObjects');

const { USER_TYPE, ROLE_TYPE } = require('../../utils/TargetConstant');

const { roles } = require('../../config.json');

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
		.setName('create-account')
		.setDescription('Créer un nouveau compte')
		.addMentionableOption(options => options.setDescription('Utilisateur ou role').setName('mention').setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {
		const mention = interaction.options.getMentionable('mention');
		const account = Account.get(mention.id);

		if (!account) {
			const type = mention.user ? USER_TYPE : ROLE_TYPE;
			const newAccount = await Accounts.create({
				target_id : mention.id,
				target_type : type,
				balance : 0,
			});
			Account.set(mention.id, newAccount);
			await interaction.reply({
				content : `Compte crée pour ${mention}`,
				ephemeral : true,
			});
			return;
		}
		else {
			await interaction.reply({
				content : `Un compte existe déjà pour ${mention}. Utiliser /bank @${mention.name} pour consulter le solde`,
				ephemeral : true,
			});
			return;
		}

	},
};