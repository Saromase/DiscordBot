module.exports = (sequelize, DataTypes) => {
	return sequelize.define('offers', {
		id : {
			type : DataTypes.UUIDV4,
			primaryKey: true,
		},
		shop_id : {
			type: DataTypes.UUIDV4,
		},
		name : {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
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