module.exports = (sequelize, DataTypes) => {
	return sequelize.define('employees', {
		user_id : {
			type : DataTypes.STRING,
			primaryKey: true,
		},
		deleted : {
			type : DataTypes.BOOLEAN,
			default : false,
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