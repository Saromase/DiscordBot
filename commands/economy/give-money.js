const {
	SlashCommandBuilder,
} = require('@discordjs/builders');

const {
	Account,
} = require('../../collectionInit');

const {
	Accounts,
} = require('../../dbObjects');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('give-money')
		.setDescription('Replies the bank of user!')
		.addMentionableOption(options => options.setDescription('Personnes ou entité à payer').setName('mention').setRequired(true))
		.addIntegerOption(options => options.setDescription('Montant à payer').setName('amount').setRequired(true)),
	async execute(interaction) {
		const mention = interaction.options.getMentionable('mention');
		const amount = interaction.options.getInteger('amount');


		if (amount < 0) {
			interaction.reply({
				content : 'Le montant doit être positif ! ',
				ephemeral : true,
			});
		}
		const user = interaction.user;
		const userAccount = Account.get(user.id);
		const mentionAccount = Account.get(mention.id);

		if (!mentionAccount) {
			interaction.reply({
				content : 'Votre destinataire n\'as pas encore de compte, réessayer plus tard.',
				ephemeral : true,
			});
		}

		if (!userAccount) {
			interaction.reply({
				content : 'Vous n\'avez pas de compte, veuillez contacté la mairie.',
				ephemeral : true,
			});
		}

		console.log(amount, userAccount, userAccount.balance);

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