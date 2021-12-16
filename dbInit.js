const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Works = require('./models/Works.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/Licenses.js')(sequelize, Sequelize.DataTypes);
require('./models/Shops.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const users = [
		Users.upsert({ user_id : '117405920392118277', balance : 1000 }),
	];
	const works = [
		Works.upsert({ role_id : '920015956032503858', name : 'Policier', pay : 100 }),
		Works.upsert({ role_id : '920016153672306709', name : 'Fermier', pay : 150 }),
	];

	await Promise.all(works);
	await Promise.all(users);


	sequelize.close();
}).catch(console.error);
