const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Accounts = require('./models/Accounts.js')(sequelize, Sequelize.DataTypes);
require('./models/Works.js')(sequelize, Sequelize.DataTypes);
require('./models/Licenses.js')(sequelize, Sequelize.DataTypes);
const Shops = require('./models/Shops.js')(sequelize, Sequelize.DataTypes);
require('./models/Offers.js')(sequelize, Sequelize.DataTypes);
const Employees = require('./models/Employees.js')(sequelize, Sequelize.DataTypes);

Shops.hasMany(Employees, {
	foreignKey : 'shop_id',
});

// const { USER_TYPE } = require('./utils/TargetConstant');

// association
// UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	// const accounts = [
	// 	Accounts.upsert({ target_id : '117405920392118277', target_type : USER_TYPE, balance : 1000 }),
	// ];
	// const works = [
	// 	Works.upsert({ role_id : '920015956032503858', name : 'Policier', pay : 100 }),
	// 	Works.upsert({ role_id : '920016153672306709', name : 'Fermier', pay : 150 }),
	// ];

	// await Promise.all(accounts);


	// sequelize.close();
}).catch(console.error);
