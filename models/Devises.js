module.exports = (sequelize, DataTypes) => {
	return sequelize.define('devises', {
		name: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		symbol: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue : true,
		},
	}, {
		timestamps: false,
	});
};