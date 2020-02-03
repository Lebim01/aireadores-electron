'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('node', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      channel: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER,
        comment: "positive small integer"
      },
      num: {
        type: Sequelize.INTEGER,
        comment: "positive small integer, par"
      },
      status: {
        type: Sequelize.ENUM('encendido', 'apagado'),
        defaultValue : 'encendido',
      },
      rssi: {
        type: Sequelize.FLOAT,
        comment: "potencia"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      last_updated: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('node');
  }
};