module.exports = (sequelize, DataTypes) => {
	return sequelize.define('accounts', {
		target_id: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		target_type : {
			type: DataTypes.STRING,
			allowNull : false,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};

/**
 * | name        | type                  |
 * | target_id   | identifiant           |
 * | target_type | user | role           |
 * | balance     | montant sur le compte |
 */