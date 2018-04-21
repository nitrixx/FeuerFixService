import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { login as loginSchema } from '../../schema';
import { login } from './handler';

const routes = Router();

routes.post('/', validate({ body: loginSchema }), async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const response = await login(username, password);
    res.json(response);
  } catch (err) { return next(err); }
});

export default routes;
