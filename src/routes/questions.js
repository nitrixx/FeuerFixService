import { Router } from 'express';
import { Question } from '../models'

const routes = Router();

routes.get('/', async (req, res) => {
  const questions = await Question.findAll({});
  res.json({ questions });
});

routes.get('/:categoryId', async (req, res) => {
  const { params: { categoryId: FachgebietID } } = req;
  const questions = await Question.findAll({ where: { FachgebietID } });
  res.json({ questions });
});

export default routes;
