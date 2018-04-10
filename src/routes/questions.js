import { Router } from 'express';
import { frage } from '../models'

const routes = Router();

routes.get('/:categoryId', async (req, res) => {
  const { params: { categoryId: FachgebietID } } = req;
  const questions = await frage.findAll({ where: { FachgebietID } });
  res.json({ questions });
});

export default routes;
