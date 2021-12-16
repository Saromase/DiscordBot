const {
	Users,
} = require('../dbObjects');

const {
	Currency,
} = require('../collectionInit');

const cron = require('node-cron');

const displaySalary = require('../crons/displaySalary');


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const storedBalances = await Users.findAll();
		if (storedBalances.length > 0) {
			storedBalances.forEach(b => Currency.set(b.user_id, b));
		}
		console.log(`Ready! Logged in as ${client.user.tag}`);


		// cron.schedule('* * * * *', async () => { displaySalary(client)});
		cron.schedule('0 12,16,22 * * *', async () => { displaySalary(client);});
	},
};