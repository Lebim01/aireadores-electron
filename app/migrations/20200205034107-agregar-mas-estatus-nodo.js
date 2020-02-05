'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.removeColumn(
        'node',
        'status',
        { transaction }
      );

      await queryInterface.addColumn(
        'node',
        'status',
        {
          type: Sequelize.DataTypes.ENUM('desconectado', 'horario', 'manual', 'detenido'),
        },
        { transaction }
      );

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn(
        'node',
        'status',
        { transaction }
      );
      await queryInterface.addColumn(
        'node',
        'status',
        {
          type: Sequelize.DataTypes.ENUM('encendido', 'apagado'),
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
