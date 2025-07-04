'use strict';

const migration = {
  async up(queryInterface, Sequelize) {
    // Primeiro, vamos buscar os IDs dos tipos de relatório
    const tiposRelatorio = await queryInterface.sequelize.query(
      'SELECT id, tipo FROM tipos_relatorio;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const relatorios = [];
    const tipos = {
      Gerencial: tiposRelatorio.find(t => t.tipo === 'Gerencial').id,
      Financeiro: tiposRelatorio.find(t => t.tipo === 'Financeiro').id,
      Operacional: tiposRelatorio.find(t => t.tipo === 'Operacional').id
    };

    // Relatórios Gerenciais
    for (let i = 1; i <= 20; i++) {
      relatorios.push({
        nome: `Relatório de Desempenho ${i}`,
        descricao: `Análise gerencial detalhada do desempenho operacional do período ${i}`,
        tipo_relatorio_id: tipos.Gerencial,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Relatórios Financeiros
    for (let i = 1; i <= 20; i++) {
      relatorios.push({
        nome: `Balanço Financeiro ${i}`,
        descricao: `Demonstrativo financeiro completo do período ${i} com análise de receitas e despesas`,
        tipo_relatorio_id: tipos.Financeiro,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Relatórios Operacionais
    for (let i = 1; i <= 20; i++) {
      relatorios.push({
        nome: `Relatório de Produção ${i}`,
        descricao: `Indicadores operacionais e métricas de produção do setor ${i}`,
        tipo_relatorio_id: tipos.Operacional,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('relatorios', relatorios);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('relatorios', null, {});
  }
};

export default migration; 