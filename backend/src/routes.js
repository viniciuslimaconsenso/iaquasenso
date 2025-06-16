import { Router } from 'express';
import RelatorioController from './controllers/RelatorioController.js';

const routes = Router();

routes.get('/relatorios', RelatorioController.index);
routes.get('/relatorios/:id', RelatorioController.show);
routes.post('/relatorios', RelatorioController.store);
routes.put('/relatorios/:id', RelatorioController.update);
routes.delete('/relatorios/:id', RelatorioController.destroy);

export default routes; 