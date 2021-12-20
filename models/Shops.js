module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shops', {
		id : {
			type : DataTypes.UUIDV4,
			primaryKey: true,
		},
		owner_id : {
			type: DataTypes.STRING,
		},
		role_id : {
			type: DataTypes.STRING,
		},
		channel_id : {
			type: DataTypes.STRING,
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