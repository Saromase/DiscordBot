const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Accounts = require('./models/Accounts.js')(sequelize, Sequelize.DataTypes);

const Works = require('./models/Works.js')(sequelize, Sequelize.DataTypes);

const Licenses = require('./models/Licenses.js')(sequelize, Sequelize.DataTypes);

const Shops = require('./models/Shops.js')(sequelize, Sequelize.DataTypes);


module.exports = {
	Accounts,
	Works,
	Licenses,
	Shops,
};