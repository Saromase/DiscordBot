const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Accounts = require('./models/Accounts.js')(sequelize, Sequelize.DataTypes);

const Devises = require('./models/Devises.js')(sequelize, Sequelize.DataTypes);


// const Works = require('./models/Works.js')(sequelize, Sequelize.DataTypes);

// const Licenses = require('./models/Licenses.js')(sequelize, Sequelize.DataTypes);

const Shops = require('./models/Shops.js')(sequelize, Sequelize.DataTypes);

// const Offers = require('./models/Offers.js')(sequelize, Sequelize.DataTypes);

// const Employees = require('./models/Employees.js')(sequelize, Sequelize.DataTypes);

Accounts.belongsTo(Devises, {
	foreignKey : 'deviseName',
});

// Shops.hasMany(Employees, {
// 	foreignKey : 'shop_id',
// });


module.exports = {
	Accounts,
	Devises,
	// Works,
	// Licenses,
	Shops,
	// Offers,
	// Employees,
};