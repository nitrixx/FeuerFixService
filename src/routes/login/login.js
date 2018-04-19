import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { login as loginSchema } from '../../schema';
import { User } from '../../models';7
import { createError } from '../../util';

const routes = Router();
const ONEDAY = 24 * 60 * 60

routes.post('/', validate({ body: loginSchema }) ,async (req, res, next) => {
  const loginFail = createError('Username or password wrong', 401);
  const notEnabled = createError('Your account has to be activated by an administrator first.', 401);
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return next(loginFail);
  }

  if (!user.isEnabled) {
    return next(notEnabled);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(loginFail);
  }

  const token = await jwt.sign({
    id: user.id,
    isEnabled: user.isEnabled,
    isAdmin: user.isAdmin,
  }, process.env.JWT_SECRET, { expiresIn: ONEDAY });

  res.json({ id: user.id, token });

});

export default routes;
