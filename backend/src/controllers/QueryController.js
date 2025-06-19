import connection from '../database/index.js';

class QueryController {
  async execute(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query não fornecida' });
      }

      // Converter para minúsculas para facilitar as verificações
      const queryLower = query.toLowerCase();

      // Verificar se é apenas SELECT
      if (!queryLower.trim().startsWith('select')) {
        return res.status(403).json({ 
          error: 'Apenas queries SELECT são permitidas' 
        });
      }

      // Lista de palavras-chave proibidas
      const forbiddenKeywords = [
        'insert',
        'update',
        'delete',
        'drop',
        'truncate',
        'alter',
        'create',
        'replace',
        'exec',
        'execute',
        'relatorios', // Proteger a tabela de relatórios
        'tipos_relatorio', // Proteger a tabela de tipos de relatório
        ';', // Evitar múltiplas queries
        '--', // Evitar comentários SQL
        '/*', // Evitar comentários SQL
        '*/' // Evitar comentários SQL
      ];

      // Verificar palavras-chave proibidas
      for (const keyword of forbiddenKeywords) {
        if (queryLower.includes(keyword)) {
          return res.status(403).json({ 
            error: `Operação não permitida: ${keyword}` 
          });
        }
      }

      // Verificar se há tentativa de múltiplas queries
      if (query.includes(';')) {
        return res.status(403).json({ 
          error: 'Múltiplas queries não são permitidas' 
        });
      }

      // Executar a query
      const result = await connection.query(query, {
        type: connection.QueryTypes.SELECT,
        raw: true,
      });

      return res.json(result);
    } catch (error) {
      console.error('Erro ao executar query:', error);
      
      // Não expor detalhes do erro para o cliente
      return res.status(500).json({ 
        error: 'Erro ao executar a query. Verifique a sintaxe e tente novamente.' 
      });
    }
  }

  // Método para testar a query com exemplos
  async examples(req, res) {
    try {
      const examples = {
        "Resumo de Vendas por Cliente": `
          SELECT 
            c.nome as cliente,
            COUNT(v.id) as total_vendas,
            SUM(vi.quantidade * vi.preco_unitario) as valor_total
          FROM clientes c
          LEFT JOIN vendas v ON v.cliente_id = c.id
          LEFT JOIN venda_itens vi ON vi.venda_id = v.id
          GROUP BY c.id, c.nome
          ORDER BY valor_total DESC
        `,
        "Produtos Mais Vendidos": `
          SELECT 
            p.nome as produto,
            SUM(vi.quantidade) as quantidade_vendida,
            p.estoque as estoque_atual
          FROM produtos p
          LEFT JOIN venda_itens vi ON vi.produto_id = p.id
          GROUP BY p.id, p.nome, p.estoque
          ORDER BY quantidade_vendida DESC
        `,
        "Vendas do Dia": `
          SELECT 
            v.id as venda_id,
            c.nome as cliente,
            p.nome as produto,
            vi.quantidade,
            vi.preco_unitario,
            (vi.quantidade * vi.preco_unitario) as total
          FROM vendas v
          JOIN clientes c ON c.id = v.cliente_id
          JOIN venda_itens vi ON vi.venda_id = v.id
          JOIN produtos p ON p.id = vi.produto_id
          WHERE DATE(v.data_venda) = CURRENT_DATE
          ORDER BY v.data_venda DESC
        `
      };

      return res.json(examples);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar exemplos' });
    }
  }
}

export default new QueryController(); 