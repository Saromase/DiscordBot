const {
	MessageEmbed,
} = require('discord.js');

module.exports = (balance, newAccount = false) => {
	const title = newAccount ? 'New Account Created' : 'Check your account';
	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(title)
		.setDescription('Your current account balance')
		.addFields({
			name: 'Current balance',
			value: `${balance} $`,
		});
};