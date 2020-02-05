'use strict'
module.exports = (sequelize, Sequelize) => {
	const Node = sequelize.define('node', {
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            validate : {
                notEmpty: {
                    msg : 'Dirección no puede ser vacio'
                },
                notNull: { msg: 'Dirección no puede ser vacio' }
            },
			comment: "Dirección"
        },
        channel: {
            type: Sequelize.STRING,
            validate : {
                notEmpty: {
                    msg : 'Canal no puede ser vacio'
                },
            },
			comment: "Canal"
        },
        role : {
            type: Sequelize.INTEGER,
			comment: "positive small integer"
        },
        num : {
            type: Sequelize.INTEGER,
            validate : {
                notEmpty: {
                    msg : 'Aireadores no puede ser vacio'
                },
            },
			comment: "positive small integer, par"
        },
        status : {
            type: Sequelize.ENUM('desconectado', 'horario', 'manual', 'detenido'),
            defaultValue : 'desconectado',
			comment: "choice"
        },
        device_id : {
            type: Sequelize.INTEGER,
			comment: "positive small integer",
            validate : {
                notEmpty: {
                    msg : 'Identificador no puede ser vacio'
                },
            },
        },
        rssi : {
            type: Sequelize.FLOAT,
			comment: "potencia"
        }
	}, {
        tableName: 'node',
        timestamps: true,
        updatedAt: 'last_updated'
    });
    
    Node.associate = (models) => {
        Node.hasMany(models.timer, {
			foreignKey: 'node_id'
        });
        Node.belongsTo(models.pool, {
            foreignKey: 'pool_id',
            onDelete: 'RESTRICT'
        })
        Node.hasMany(models.timer_history, {
            foreignKey: 'node_id'
        })
	}

	return Node;
}
