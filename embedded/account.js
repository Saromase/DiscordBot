const {
	MessageEmbed,
} = require('discord.js');

module.exports = (balance) => {
	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Compte en banque')
		.setDescription('Montant disponible actuellement')
		.addFields({
			name: 'Somme',
			value: `${balance} $`,
		});
};