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
	roles,
} = require('../../config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Transfert un montant vers un autre compte (Attention, cette attention est irréversible')
		.addIntegerOption(options => options.setDescription('Montant à payer').setName('amount').setRequired(true))
		.addMentionableOption(options => options.setDescription('Personnes ou Commerce à payer').setName('mention').setRequired(true)),
	async execute(interaction) {
		const mention = interaction.options.getMentionable('mention');
		let amount = parseInt(interaction.options.getInteger('amount'), 10);
		const user = interaction.user;
		const userRoles = interaction.guild.members.cache.get(interaction.user.id).roles;
		const isAdmin = userRoles.cache.get(roles.admin);

		const userAccount = Account.get(user.id);
		const mentionAccount = Account.get(mention.id);

		const nickname = interaction.guild.members.cache.get(interaction.user.id).nickname;

		if (!mentionAccount) {
			interaction.reply({
				content : 'Votre destinataire n\'as pas encore de compte, réessayer plus tard.',
				ephemeral : true,
			});
			return;
		}

		if (!userAccount) {
			interaction.reply({
				content : 'Vous n\'avez pas de compte, veuillez contacté la mairie.',
				ephemeral : true,
			});
			return;
		}

		console.log();


		if (amount < 0) {
			if (isAdmin) {
				amount = amount * -1;
				Accounts.update({
					balance : (mentionAccount.balance + amount),
				}, {
					where : {
						target_id : mention.id,
					},
				});

				interaction.reply({
					content : `Le compte de ${mention} à était approvisionner de ${amount}`,
					ephemeral : true,
				});

				if (mention.user) {
					mention.send(`${nickname} vous à transféré ${amount}`);
				}
				return;
			}
			else {
				interaction.reply({
					content : 'Le montant doit être positif ! ',
					ephemeral : true,
				});
			}
		}
		if (userAccount.balance >= amount) {
			const promises = [
				Accounts.update({
					balance : (userAccount.balance - amount),
				}, {
					where : {
						target_id : user.id,
					},
				}),
				Accounts.update({
					balance : (mentionAccount.balance + amount),
				}, {
					where : {
						target_id : mention.id,
					},
				}),
			];

			await Promise.all(promises).then(() => {

				interaction.reply({
					content : `Vous avez payé ${amount} à ${mention}`,
					ephemeral : true,
				});
				console.log(user);

				if (mention.user) {
					mention.send(`${nickname} vous à transféré ${amount}`);
				}

			}).catch(() => {
				console.error(`Une erreur s'est produite lors de l'envoi d'argent entre ${mention} et ${user} d'un montant de ${amount}`);
				interaction.reply({
					content : 'Une erreur s\'est produite, veuillez contacter l\'administrateur du serveur',
					ephemeral : true,
				});
			});


		}
		else {
			interaction.reply({
				content : `Vous n'avez pas l'argent requis. Vous avez actuellement ${userAccount.balance}`,
				ephemeral : true,
			});
		}
	},
};