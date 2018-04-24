import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { forbidden } from '../../commonErrors';
import { category as categorySchema } from '../../schema';
import {
  getCategories,
  createCategory,
  prefetchCategory,
  deleteCategory,
} from './handler';

const routes = Router();

routes.param('categoryId', async (req, res, next, categoryId) => {
  try {
    req.category = await prefetchCategory(categoryId);
    return next();
  } catch (err) { return next(err); }
});

routes.get('/', async (req, res, next) => {
  const { isAdmin } = req.user;
  if (!isAdmin) { return next(forbidden); }

  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (err) { return next(err); }
});

routes.get('/:categoryId', async (req, res) => {
  const { id, name, Questions } = req.category;
  res.json({ id, name, questionCount: Questions.length });
});

routes.get('/:categoryId/questions', async (req, res) => {
  const { category: { Questions: questions } } = req;
  res.json({questions});
});

routes.post('/', validate({ body: categorySchema }), async (req, res, next) => {
  const { body: { name }, user: { isAdmin } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await createCategory(name);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.delete('/:categoryId', async (req, res, next) => {
  const { category, user: { isAdmin } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await deleteCategory(category);
    res.json(response);
  } catch (err) { return next(err); }
});

export default routes;
