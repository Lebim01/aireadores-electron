'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      node_id: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.ENUM('RUN SCHEDULE', 'STOP SCHEDULE', 'RUN TIMER', 'STOP TIMER', 'GROUP RUN TIMER', 'WRONG STATUS', 'SET SCHEDULE')
      },
      response: {
        type: Sequelize.STRING
      },
      node_repr : {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('desconectado', 'horario', 'manual', 'detenido')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('event');
  }
};
