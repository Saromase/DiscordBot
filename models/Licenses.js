module.exports = (sequelize, DataTypes) => {
	return sequelize.define('licenses', {
		user_id: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
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