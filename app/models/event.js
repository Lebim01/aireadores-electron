'use strict'
module.exports = (sequelize, Sequelize) => {
	const Event = sequelize.define('event', {
        response : {
            type: Sequelize.STRING
        },
        action : {
            type: Sequelize.ENUM('RUN SCHEDULE', 'STOP SCHEDULE', 'RUN TIMER', 'STOP TIMER', 'GROUP RUN TIMER', 'WRONG STATUS', 'SET SCHEDULE')
        },
        status : {
            type: Sequelize.ENUM('desconectado', 'horario', 'manual', 'detenido'),
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
