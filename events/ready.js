const {
	Accounts,
} = require('../dbObjects');

const {
	Account,
} = require('../collectionInit');

const cron = require('node-cron');

const displaySalary = require('../crons/displaySalary');


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const storedBalances = await Accounts.findAll();
		if (storedBalances.length > 0) {
			storedBalances.forEach(async b => {
				const devise = await b.getDevise();
				console.log(devise);
				Account.set(b.target_id, { balance : b.balance });
			});
		}
		console.log(`Ready! Logged in as ${client.user.tag}`);


		// cron.schedule('* * * * *', async () => { displaySalary(client)});
		// cron.schedule('0 12,16,22 * * *', async () => { displaySalary(client);});
	},
};