import prisma from '../lib/prisma.js';

class TipoRelatorioController {
  async index(req, res) {
    try {
      const tiposRelatorio = await prisma.tipoRelatorio.findMany({
        orderBy: {
          tipo: 'asc'
        }
      });
      
      return res.json(tiposRelatorio);
    } catch (error) {
      console.error('Erro ao buscar tipos de relatório:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new TipoRelatorioController(); 