import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// Função para converter BigInt para Number em objetos
const convertBigIntToNumber = (data) => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'bigint') {
    return Number(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(convertBigIntToNumber);
  }
  
  if (typeof data === 'object') {
    const converted = {};
    for (const key in data) {
      converted[key] = convertBigIntToNumber(data[key]);
    }
    return converted;
  }
  
  return data;
};

class QueryController {
  async execute(req, res) {
    try {
      const { query, parameters } = req.body;

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

      // Se houver parâmetros, validar e preparar
      let finalQuery = query;
      let queryParams = {};

      if (parameters && Object.keys(parameters).length > 0) {
        // Validar os parâmetros
        for (const [key, value] of Object.entries(parameters)) {
          if (value === undefined || value === null || value === '') {
            return res.status(400).json({
              error: `Parâmetro ${key} é obrigatório`
            });
          }
          
          // Verificar se o parâmetro existe na query
          if (!query.includes(`:${key}`)) {
            return res.status(400).json({
              error: `Parâmetro ${key} não encontrado na query`
            });
          }

          // Adicionar ao objeto de parâmetros
          queryParams[key] = value;
        }
      }

      // Executar a query usando Prisma
      const result = await prisma.$queryRawUnsafe(finalQuery, ...Object.values(queryParams));
      
      // Converter BigInt para Number antes de enviar a resposta
      const convertedResult = convertBigIntToNumber(result);

      return res.json(convertedResult);
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
        "Vendas por Período": {
          query: `
            SELECT 
              c.nome as cliente,
              COUNT(v.id) as total_vendas,
              SUM(vi.quantidade * vi.preco_unitario) as valor_total
            FROM clientes c
            LEFT JOIN vendas v ON v.cliente_id = c.id
            LEFT JOIN venda_itens vi ON vi.venda_id = v.id
            WHERE v.data_venda BETWEEN :data_inicio AND :data_fim
            GROUP BY c.id, c.nome
            ORDER BY valor_total DESC
          `,
          parameters: [
            {
              nome: "data_inicio",
              tipo: "date",
              tamanho: "10",
              label: "Data Inicial"
            },
            {
              nome: "data_fim",
              tipo: "date",
              tamanho: "10",
              label: "Data Final"
            }
          ]
        },
        "Vendas por Produto": {
          query: `
            SELECT 
              p.nome as produto,
              SUM(vi.quantidade) as quantidade_vendida,
              SUM(vi.quantidade * vi.preco_unitario) as valor_total
            FROM produtos p
            LEFT JOIN venda_itens vi ON vi.produto_id = p.id
            LEFT JOIN vendas v ON v.id = vi.venda_id
            WHERE p.id = :produto_id
            GROUP BY p.id, p.nome
          `,
          parameters: [
            {
              nome: "produto_id",
              tipo: "number",
              tamanho: "10",
              label: "Produto"
            }
          ]
        }
      };

      return res.json(examples);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar exemplos' });
    }
  }
}

export default new QueryController(); 