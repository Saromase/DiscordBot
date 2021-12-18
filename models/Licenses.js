module.exports = (sequelize, DataTypes) => {
	return sequelize.define('licenses', {
		target_id: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		target_type : {
			type: DataTypes.STRING,
			allowNull : false,
		},
		type : {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		subtype : {
			type: DataTypes.STRING,
			allowNull : true,
			defaultValue : null,
		},
		date : {
			type: DataTypes.DATE,
			allowNull : false,
		},
	}, {
		timestamps: false,
	});
};


/**
 * | name        | type                                  |
 * | target_id   | role ou user ou shop                  |
 * | target_type | Type de la target                     |
 * | type        | driver / weapon / buziness            |
 * | subtype     | weapon   -> catégorie (1,2 ,3 )       |
 * | -           | driver   -> auto, truck               |
 * | -           | buziness -> drunk, food, registration |
 * | date        | datetime                              |
 */