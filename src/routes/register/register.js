import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { user as userSchema } from '../../schema';
import { createUser } from './handler';

const routes = Router();

routes.post('/', validate({ body: userSchema }), async (req, res, next) => {
  const { body: userData } = req;

  try {
    const createdUser = await createUser(userData);
    res.json({ message: 'User has been successfully created', id: createdUser.id });
  } catch (err) { return next(err); }
});

export default routes;
