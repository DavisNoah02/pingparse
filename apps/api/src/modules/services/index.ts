import { Router } from 'express';
import { servicesController } from './services.controller.ts';

export const servicesRouter = Router();

servicesRouter.get('/',      servicesController.getAll);
servicesRouter.get('/:id',   servicesController.getById);
servicesRouter.post('/',     servicesController.create);
servicesRouter.patch('/:id', servicesController.update);
servicesRouter.delete('/:id',servicesController.remove);