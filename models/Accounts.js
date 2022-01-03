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
			type: DataTypes.DECIMAL,
			defaultValue: 0,
			allowNull: false,
		},
		pocket: {
			type: DataTypes.DECIMAL,
			defaultValue: 0,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue : true,
		},
		precision : {
			type : DataTypes.INTEGER,
			defaultValue : 1,
		},
	}, {
		timestamps: false,
	});
};