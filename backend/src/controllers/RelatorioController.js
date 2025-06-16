import { Relatorio, TipoRelatorio } from '../models/index.js';

class RelatorioController {
  async index(req, res) {
    try {
      const relatorios = await Relatorio.findAll({
        include: [{
          model: TipoRelatorio,
          as: 'tipo',
          attributes: ['tipo']
        }]
      });
      return res.json(relatorios);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar relatórios' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorio.findByPk(id, {
        include: [{
          model: TipoRelatorio,
          as: 'tipo',
          attributes: ['tipo']
        }]
      });

      if (!relatorio) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      return res.json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar relatório' });
    }
  }

  async store(req, res) {
    try {
      const { nome, descricao, tipo_relatorio_id } = req.body;

      const relatorio = await Relatorio.create({
        nome,
        descricao,
        tipo_relatorio_id
      });

      return res.status(201).json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar relatório' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, tipo_relatorio_id } = req.body;

      const relatorio = await Relatorio.findByPk(id);

      if (!relatorio) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      await relatorio.update({
        nome,
        descricao,
        tipo_relatorio_id
      });

      return res.json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar relatório' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const relatorio = await Relatorio.findByPk(id);

      if (!relatorio) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      await relatorio.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir relatório' });
    }
  }
}

export default new RelatorioController(); 