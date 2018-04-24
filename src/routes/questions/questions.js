import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { forbidden } from '../../commonErrors';
import { getQuestions, createQuestion, prefetchQuestion, updateQuestion, deleteQuestion } from './handler';
import {
  questionQuery,
  question as questionSchema,
  questionUpdate as questionUpdateSchema,
  answer as answerSchema,
} from '../../schema';

const routes = Router();

routes.param('questionId', async (req, res, next, questionId) => {
  try {
    req.dbQuestion = await prefetchQuestion(questionId);
    return next();
  } catch (err) { return next(err); }
});

routes.get('/', validate({ query: questionQuery }), async (req, res, next) => {
  const { user: { isAdmin }, query: { search } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const questions = await getQuestions(search);
    res.json({ questions });
  } catch (err) { return next(err); }
});

routes.get('/:questionId', async (req, res) => {
  res.json(req.dbQuestion);
});

routes.post('/', validate({ body: questionSchema }, [answerSchema]), async (req, res, next) => {
  const { user: { isAdmin }, body: { text, categoryId, answers } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await createQuestion(text, categoryId, answers);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.put('/:questionId', validate({ body: questionUpdateSchema }, [answerSchema]), async (req, res, next) => {
  const { body: { text, categoryId, answers }, user: { isAdmin }, dbQuestion } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await updateQuestion(dbQuestion, text, categoryId, answers);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.delete('/:questionId', async (req, res, next) => {
  const { user: { isAdmin }, dbQuestion: { id } } = req;
  if (!isAdmin) { throw forbidden; }

  try {
    const response = await deleteQuestion(id);
    res.json(response);
  } catch (err) { return next (err); }
});

export default routes;
