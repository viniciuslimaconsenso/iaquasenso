'use strict';

const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tipos_relatorio', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Inserir os tipos padrão
    await queryInterface.bulkInsert('tipos_relatorio', [
      { tipo: 'Gerencial', created_at: new Date(), updated_at: new Date() },
      { tipo: 'Financeiro', created_at: new Date(), updated_at: new Date() },
      { tipo: 'Operacional', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tipos_relatorio');
  }
};

export default migration; 