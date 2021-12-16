const {
	MessageEmbed,
} = require('discord.js');

module.exports = (role, amount = 0) => {
	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Salary payment for ${role}`)
		.addFields({
			name: 'Payment',
			value: `${amount} $`,
		});
};