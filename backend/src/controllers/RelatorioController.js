import prisma from '../lib/prisma.js';

class RelatorioController {
  async index(req, res) {
    try {
      const relatorios = await prisma.relatorio.findMany({
        include: {
          tipoRelatorio: true,
          parametros: true,
          query: true
        }
      });
      return res.json(relatorios);
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store(req, res) {
    try {
      const { nome, descricao, query_id, tipo_relatorio_id, has_parameters, parameters } = req.body;

      // Criar o relatório associado à query
      const relatorio = await prisma.relatorio.create({
        data: {
          nome,
          descricao,
          queryId: query_id,
          hasParameters: has_parameters,
          tipoRelatorioId: tipo_relatorio_id,
          parametros: has_parameters && parameters ? {
            create: parameters.map(param => ({
              nome: param.nome,
              tipo: param.tipo,
              tamanho: param.tamanho,
              label: param.label
            }))
          } : undefined
        },
        include: {
          parametros: true,
          query: true
        }
      });

      return res.status(201).json(relatorio);
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const relatorio = await prisma.relatorio.findUnique({
        where: { id: Number(id) },
        include: {
          tipoRelatorio: true,
          parametros: true,
          query: true
        }
      });

      if (!relatorio) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      return res.json(relatorio);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, query, tipo_relatorio_id, has_parameters, parameters } = req.body;

      // Primeiro, atualizar ou criar o registro de Query
      let queryId;
      const existingRelatorio = await prisma.relatorio.findUnique({
        where: { id: Number(id) },
        include: { query: true }
      });

      if (existingRelatorio.queryId) {
        // Atualizar query existente
        await prisma.query.update({
          where: { id: existingRelatorio.queryId },
          data: { query }
        });
        queryId = existingRelatorio.queryId;
      } else {
        // Criar nova query
        const queryRecord = await prisma.query.create({
          data: { query }
        });
        queryId = queryRecord.id;
      }

      // Depois, atualizar o relatório
      const relatorio = await prisma.relatorio.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          queryId,
          hasParameters: has_parameters,
          tipoRelatorioId: tipo_relatorio_id,
          parametros: {
            deleteMany: {},
            ...(has_parameters && parameters ? {
              create: parameters.map(param => ({
                nome: param.nome,
                tipo: param.tipo,
                tamanho: param.tamanho,
                label: param.label
              }))
            } : {})
          }
        },
        include: {
          parametros: true,
          query: true
        }
      });

      return res.json(relatorio);
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      // Primeiro, buscar o relatório para obter o ID da query
      const relatorio = await prisma.relatorio.findUnique({
        where: { id: Number(id) },
        select: { queryId: true }
      });

      if (relatorio && relatorio.queryId) {
        // Deletar a query associada
        await prisma.query.delete({
          where: { id: relatorio.queryId }
        });
      }

      // Depois, deletar o relatório
      await prisma.relatorio.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new RelatorioController(); 