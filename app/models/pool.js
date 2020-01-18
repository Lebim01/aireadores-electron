module.exports = (sequelize, Sequelize) => {
	const Pool = sequelize.define('pool', {
        name: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false,
			comment: "Nombre de la psicina"
        }
	}, {
		tableName: 'pool'
	});

	return Pool;
}