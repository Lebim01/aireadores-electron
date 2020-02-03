module.exports = (sequelize, Sequelize) => {
	const Device = sequelize.define('device', {
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false,
			comment: "Nombre"
        }
	}, {
		tableName: 'device'
	});

	return Device;
}