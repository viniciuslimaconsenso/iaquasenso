'use strict';

const migration = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar a coluna query
    await queryInterface.addColumn('relatorios', 'query', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Buscar todos os relatórios existentes
    const relatorios = await queryInterface.sequelize.query(
      'SELECT id, nome, tipo_relatorio_id FROM relatorios',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Queries para cada tipo de relatório
    const queries = {
      // Relatório Gerencial (tipo_relatorio_id: 1)
      gerencial: {
        'Resumo de Vendas por Cliente': `SELECT 
  c.nome as cliente,
  COUNT(v.id) as total_vendas,
  SUM(vi.quantidade * vi.preco_unitario) as valor_total,
  MAX(v.data_venda) as ultima_compra
FROM clientes c
LEFT JOIN vendas v ON v.cliente_id = c.id
LEFT JOIN venda_itens vi ON vi.venda_id = v.id
GROUP BY c.id, c.nome
ORDER BY valor_total DESC`,
        'Dashboard Comercial': `SELECT 
  p.nome as produto,
  SUM(vi.quantidade) as quantidade_vendida,
  SUM(vi.quantidade * vi.preco_unitario) as receita_total,
  p.estoque as estoque_atual
FROM produtos p
LEFT JOIN venda_itens vi ON vi.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque
ORDER BY quantidade_vendida DESC`,
      },
      // Relatório Financeiro (tipo_relatorio_id: 2)
      financeiro: {
        'Faturamento por Período': `SELECT 
  CAST(v.data_venda AS DATE) as data,
  COUNT(DISTINCT v.id) as num_vendas,
  SUM(vi.quantidade * vi.preco_unitario) as valor_total
FROM vendas v
JOIN venda_itens vi ON vi.venda_id = v.id
GROUP BY CAST(v.data_venda AS DATE)
ORDER BY data DESC`,
        'Análise de Produtos': `SELECT 
  p.nome,
  p.preco as preco_atual,
  SUM(vi.quantidade) as unidades_vendidas,
  AVG(vi.preco_unitario) as preco_medio_vendido,
  SUM(vi.quantidade * vi.preco_unitario) as receita_total
FROM produtos p
LEFT JOIN venda_itens vi ON vi.produto_id = p.id
GROUP BY p.id, p.nome, p.preco
ORDER BY receita_total DESC`,
      },
      // Relatório Operacional (tipo_relatorio_id: 3)
      operacional: {
        'Controle de Estoque': `SELECT 
  p.nome,
  p.estoque as estoque_atual,
  COALESCE(SUM(vi.quantidade), 0) as total_vendido,
  p.preco as preco_atual
FROM produtos p
LEFT JOIN venda_itens vi ON vi.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque, p.preco
ORDER BY p.estoque ASC`,
        'Histórico de Vendas': `SELECT 
  v.id as venda_id,
  c.nome as cliente,
  v.data_venda,
  p.nome as produto,
  vi.quantidade,
  vi.preco_unitario,
  (vi.quantidade * vi.preco_unitario) as total
FROM vendas v
JOIN clientes c ON c.id = v.cliente_id
JOIN venda_itens vi ON vi.venda_id = v.id
JOIN produtos p ON p.id = vi.produto_id
ORDER BY v.data_venda DESC`,
      },
    };

    // Atualizar cada relatório com sua query correspondente
    for (const relatorio of relatorios) {
      let query = '';
      
      switch (relatorio.tipo_relatorio_id) {
        case 1: // Gerencial
          query = queries.gerencial[relatorio.nome] || queries.gerencial['Resumo de Vendas por Cliente'];
          break;
        case 2: // Financeiro
          query = queries.financeiro[relatorio.nome] || queries.financeiro['Faturamento por Período'];
          break;
        case 3: // Operacional
          query = queries.operacional[relatorio.nome] || queries.operacional['Controle de Estoque'];
          break;
      }

      if (query) {
        await queryInterface.sequelize.query(
          'UPDATE relatorios SET query = ? WHERE id = ?',
          {
            replacements: [query.trim(), relatorio.id],
            type: queryInterface.sequelize.QueryTypes.UPDATE,
          }
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('relatorios', 'query');
  }
};

export default migration; 