import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { forbidden } from '../../commonErrors';
import { answerUpdate as answerSchema } from '../../schema';
import { prefetchAnswer, updateAnswer, deleteAnswer } from './handler';

const routes = Router();

routes.param('answerId', async (req, res, next, answerId) => {
  try {
    req.answer = await prefetchAnswer(answerId);
    next();
  } catch (err) { return next(err); }
});

routes.put('/:answerId', validate({ body: answerSchema }), async (req, res, next) => {
  const {
    answer,
    user: { isAdmin },
    body: { text, isCorrect, questionId },
  } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await updateAnswer(answer, text, isCorrect, questionId);
    res.json(response);
  } catch (err) { return next(err); }
});

routes.delete('/:answerId', async (req, res, next) => {
  const { answer, user: { isAdmin } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await deleteAnswer(answer);
    res.json(response);
  } catch (err) {
    return next(err);
  }
});

export default routes;
