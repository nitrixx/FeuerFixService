import { Router } from 'express';
import {
  getOverallStatistics,
  getStatisticsByCategoryId,
  getStatisticsByQuestionId,
} from './handler';

const routes = Router();

routes.get('/', async (req, res, next) => {
  const { user: { id: userId } } = req;

  try {
    const response = await getOverallStatistics(userId);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.get('/categories/:categoryId', async (req, res, next) => {
  const { user: { id: userId }, params: { categoryId } } = req;

  try {
    const response = await getStatisticsByCategoryId(userId, categoryId);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.get('/questions/:questionId', async (req, res, next) => {
  const { user: { id: userId }, params: { questionId } } = req;

  try {
    const response = await getStatisticsByQuestionId(userId, questionId);
    res.json(response);
  } catch (err) { return next(err); }
});

export default routes;
