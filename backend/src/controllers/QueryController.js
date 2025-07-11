import prisma from '../lib/prisma.js';

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
  async store(req, res) {
    try {
      const { query } = req.body;

      const queryRecord = await prisma.query.create({
        data: {
          query
        }
      });

      return res.status(201).json(queryRecord);
    } catch (error) {
      console.error('Erro ao criar query:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const queryRecord = await prisma.query.findUnique({
        where: { id: Number(id) }
      });

      if (!queryRecord) {
        return res.status(404).json({ error: 'Query não encontrada' });
      }

      return res.json(queryRecord);
    } catch (error) {
      console.error('Erro ao buscar query:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { query } = req.body;

      const queryRecord = await prisma.query.update({
        where: { id: Number(id) },
        data: {
          query
        }
      });

      return res.json(queryRecord);
    } catch (error) {
      console.error('Erro ao atualizar query:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      await prisma.query.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir query:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

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
      const queryParams = [];
      let paramCount = 1;

      if (parameters && Object.keys(parameters).length > 0) {
        console.log('Processing parameters:', parameters);
        
        // Validar os parâmetros
        for (const [key, value] of Object.entries(parameters)) {
          console.log(`Processing parameter ${key}:`, value);
          
          if (value === undefined || value === null || value === '') {
            return res.status(400).json({
              error: `Parâmetro ${key} é obrigatório`
            });
          }
          
          // Verificar se o parâmetro existe na query
          const paramPlaceholder = `:${key}`;
          if (!query.includes(paramPlaceholder)) {
            return res.status(400).json({
              error: `Parâmetro ${key} não encontrado na query`
            });
          }

          // Substituir o placeholder pelo formato $n do PostgreSQL
          const regex = new RegExp(`:${key}\\b`, 'g');
          console.log(`Replacing ${paramPlaceholder} with $${paramCount}`);
          finalQuery = finalQuery.replace(regex, `$${paramCount}`);
          paramCount++;
          
          // Converter o valor do parâmetro de acordo com seu tipo
          let processedValue = value;
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Se for uma data no formato YYYY-MM-DD, converte para objeto Date
            processedValue = new Date(value);
          } else if (typeof value === 'string' && !isNaN(value)) {
            // Se for um número em formato string, converte para número
            processedValue = Number(value);
          }
          
          queryParams.push(processedValue);
          console.log(`Added parameter value:`, processedValue);
        }
      }

      console.log('Executing query:', {
        finalQuery,
        queryParams
      });

      // Executar a query usando Prisma
      const result = await prisma.$queryRawUnsafe(finalQuery, ...queryParams);
      
      console.log('Query result:', result);
      
      // Converter BigInt para Number antes de enviar a resposta
      const convertedResult = convertBigIntToNumber(result);

      return res.json(convertedResult);
    } catch (error) {
      console.error('Erro detalhado ao executar query:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        meta: error.meta
      });
      
      // Retornar mensagem de erro mais específica
      return res.status(500).json({ 
        error: `Erro ao executar a query: ${error.message}` 
      });
    }
  }
}

export default new QueryController(); 