module.exports = (sequelize, DataTypes) => {
	return sequelize.define('transactions', {
		from_id : {
			type: DataTypes.UUIDV4,
			allowNull : false,
		},
		to_id : {
			type: DataTypes.STRING,
			allowNull : false,
		},
		reason : {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount : {
			type : DataTypes.INTEGER,
			min: 0,
		},
	}, {
		timestamps: false,
	});
};

/**
 * | name      | type                                  |
 * | id        | uuid                                  |
 * | owner_id  | user                                  |
 * | role_id   | role liée                             |
 * | name      | Nom du shop                           |
 */