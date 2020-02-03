'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('timer_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_datetime: {
        type: Sequelize.STRING(19),
        notEmpty: true,
        allowNull: false,
        comment: "YYYY-MM-DD HH:mm:ss"
      },
      end_datetime: {
        type: Sequelize.STRING(19),
        notEmpty: true,
        allowNull: false,
        comment: "YYYY-MM-DD HH:mm:ss"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('timer_history');
  }
};