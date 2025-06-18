import { Router } from 'express';
import RelatorioController from './controllers/RelatorioController.js';
import TipoRelatorioController from './controllers/TipoRelatorioController.js';

const routes = Router();

// Rotas de Relatórios
routes.get('/relatorios', RelatorioController.index);
routes.get('/relatorios/:id', RelatorioController.show);
routes.post('/relatorios', RelatorioController.store);
routes.put('/relatorios/:id', RelatorioController.update);
routes.delete('/relatorios/:id', RelatorioController.destroy);

// Rotas de Tipos de Relatório
routes.get('/tipos-relatorio', TipoRelatorioController.index);

export default routes; 