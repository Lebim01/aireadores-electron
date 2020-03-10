'use strict'
module.exports = (sequelize, Sequelize) => {
	const Event = sequelize.define('event', {
        response : {
            type: Sequelize.STRING
        },
        action : {
            type: Sequelize.ENUM('RUN SCHEDULE', 'RUN TIMER', 'STOP', 'GET STATUS', 'SET SCHEDULE')
        },
        node_status : {
            type: Sequelize.ENUM('desactivado', 'horario', 'manual', 'detenido', 'error'),
			comment: "choice"
        },
        status : {
            type: Sequelize.ENUM('success', 'error', 'warning'),
			comment: "choice"
        },
        node_repr : {
            type: Sequelize.STRING
        }
	}, {
        tableName: 'event',
        timestamps: true,
    });
    
    Event.associate = (models) => {
        Event.belongsTo(models.node, {
            foreignKey: 'node_id',
        })
	}

	return Event;
}
