export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('relatorios', 'has_parameters', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('relatorios', 'has_parameters');
  }
}; 