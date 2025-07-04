import prisma from '../lib/prisma.js';

class RelatorioController {
  async index(req, res) {
    try {
      const relatorios = await prisma.relatorio.findMany({
        include: {
          tipoRelatorio: true,
          parametros: true
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
      const { nome, descricao, query, tipo_relatorio_id, has_parameters, parameters } = req.body;

      const relatorio = await prisma.relatorio.create({
        data: {
          nome,
          descricao,
          query,
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
          parametros: true
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
          parametros: true
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

      const relatorio = await prisma.relatorio.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          query,
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
          parametros: true
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