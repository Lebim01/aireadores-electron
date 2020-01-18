module.exports = (sequelize, Sequelize) => {
	const Node = sequelize.define('node', {
        address: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false,
			comment: "Dirección"
        },
        channel: {
            type: Sequelize.STRING,
            notEmpty: true,
			allowNull: false,
			comment: "Canal"
        },
        role : {
            type: Sequelize.INTEGER,
			comment: "positive small integer"
        },
        num : {
            type: Sequelize.INTEGER,
            notEmpty: true,
			allowNull: false,
			comment: "positive small integer, par"
        },
        status : {
            type: Sequelize.ENUM('encendido', 'apagado'),
            notEmpty: true,
			allowNull: false,
			comment: "choice"
        },
        rssi : {
            type: Sequelize.FLOAT,
            notEmpty: true,
			allowNull: false,
			comment: "potencia"
        }
	}, {
        tableName: 'node',
        timestamps: true,
        updatedAt: 'last_updated'
	});

	Node.associate = (models) => {
        Node.hasMany(models.device, {
			foreignKey: 'device_id'
        });
        Node.belongsTo(models.pool, { 
            foreignKey: 'pool_id' 
        })
	}

	return Node;
}