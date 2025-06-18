import TipoRelatorio from '../models/TipoRelatorio.js';

class TipoRelatorioController {
  async index(req, res) {
    try {
      const tiposRelatorio = await TipoRelatorio.findAll({
        order: [['tipo', 'ASC']]
      });
      
      return res.json(tiposRelatorio);
    } catch (error) {
      console.error('Erro ao buscar tipos de relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new TipoRelatorioController(); 