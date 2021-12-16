const Items = require('../models/Items')(sequelize, Sequelize.DataTypes);


module.exports = () => {

    const items = [
		Items.upsert(),
		Items.upsert()
	];

    await Promise.all(items)

};