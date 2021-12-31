const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Account,
} = require('../../collectionInit');

const {
	Accounts,
} = require('../../dbObjects');

const {
	configChannel,
	roles,
} = require('../../config.json');

const { USER_TYPE, ROLE_TYPE } = require('../../utils/TargetConstant');

module.exports = {
	authorizedChan : configChannel.bank,
	data: new SlashCommandBuilder()
		.setName('bank')
		.setDescription('Retourne le compte de l\'utilisateur!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Créer un compte bancaire (Gouvernement uniquement)')
				.addMentionableOption(options => options.setDescription('Utilisateur ou role').setName('mention').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('check')
				.setDescription('Vérifie un compte bancaire.')
				.addRoleOption(option => option.setName('role').setDescription('Role')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('delete')
				.setDescription('Supprime un compte bancaire. (Gouvernement uniquement)')
				.addMentionableOption(options => options.setDescription('Utilisateur ou role').setName('mention').setRequired(true))),
	async execute(interaction) {
		let target;
		const subCommand = interaction.options.getSubcommand();
		const userRoles = interaction.guild.members.cache.get(interaction.user.id).roles;
		const adminOrModerator = userRoles.cache.get(roles.admin) || userRoles.cache.get(roles.moderator);
		if (subCommand === 'check') {
			const role = interaction.options.getRole('role');
			if (role) {
				const canCheck = userRoles.cache.get(role.id) || adminOrModerator;
				if (!canCheck) {
					await interaction.reply({ content : `Vous ne pouvez pas consulter le compte de ${role}`, ephemeral : true });
					return;
				}
			}
			target = role ?? interaction.user;
		}
		else {
			target = interaction.options.getMentionable('mention');
		}

		const account = Account.get(target.id);
		const canCreate = userRoles.cache.get(roles.government) || adminOrModerator;

		switch (subCommand) {
		case 'check':
			if (account) {
				const embed = require('../../embedded/account')(account.balance);
				await interaction.reply({
					embeds: [embed],
					ephemeral : true,
				});
			}
			else {
				await interaction.reply({ content : `Aucun compte associé à ${target}`, ephemeral : true });
			}
			break;
		case 'create':
			if (!canCreate) {
				await interaction.reply({
					content : `Vous ne pouvez pas créer de compte car vous n'êtes pas membre du ${interaction.guild.roles.cache.get(roles.government)}`,
					ephemeral : true,
				});
			}
			else if (!account) {
				const type = target.user ? USER_TYPE : ROLE_TYPE;
				const newAccount = await Accounts.create({
					target_id : target.id,
					target_type : type,
					balance : 0,
				});
				Account.set(target.id, newAccount);
				await interaction.reply({
					content : `Compte crée pour ${target}`,
					ephemeral : true,
				});
			}
			else {
				await interaction.reply({
					content : `Un compte existe déjà pour ${target}. Utiliser /bank @${target.name} pour consulter le solde`,
					ephemeral : true,
				});
			}
			break;
		case 'delete':
			if (adminOrModerator) {
				await Accounts.delete({
					where : {
						target_id : target.id,
					},
				});
				Account.delete(target.id);
				await interaction.reply({
					content : `Compte supprimer pour ${target}`,
					ephemeral : true,
				});
				await interaction.reply({
					content : `Vous ne pouvez pas créer de compte car vous n'êtes pas membre du ${interaction.guild.roles.cache.get(roles.government)}`,
					ephemeral : true,
				});
			}
			else {
				await interaction.reply({
					content : `Vous ne pouvez pas supprimer de compte car vous n'êtes pas membre du ${interaction.guild.roles.cache.get(roles.government)}`,
					ephemeral : true,
				});
			}
			break;
		}
		return;
	},
};