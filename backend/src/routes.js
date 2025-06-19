import { Router } from 'express';
import RelatorioController from './controllers/RelatorioController.js';
import TipoRelatorioController from './controllers/TipoRelatorioController.js';
import QueryController from './controllers/QueryController.js';

const routes = Router();

// Rotas de Relatórios
routes.get('/relatorios', RelatorioController.index);
routes.get('/relatorios/:id', RelatorioController.show);
routes.post('/relatorios', RelatorioController.store);
routes.put('/relatorios/:id', RelatorioController.update);
routes.delete('/relatorios/:id', RelatorioController.destroy);

// Rotas de Tipos de Relatório
routes.get('/tipos-relatorio', TipoRelatorioController.index);

// Rotas de Query SQL
routes.post('/query/execute', QueryController.execute);
routes.get('/query/examples', QueryController.examples);

export default routes; 