const {
	MessageEmbed,
} = require('discord.js');

module.exports = (devises) => {
	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Devises')
		.setDescription('Montant disponible actuellement')
		.addFields({
			name: 'Somme',
			value: `${devises.name} ${devises.symbol} $`,
		});
};