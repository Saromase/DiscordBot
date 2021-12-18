const {
	Collection,
} = require('discord.js');

const Account = new Collection();
const Commands = new Collection();

module.exports = { Account, Commands };