import { Router } from 'express';
import { validate } from 'express-jsonschema';
import bCrypt from 'bcrypt';
import { User } from '../../models';
import { user as userSchema } from '../../schema';
import { createError } from '../../util';

const routes = Router();

routes.post('/', validate({ body: userSchema }) ,async (req, res, next) => {
  const { username, name, password, confirmPassword } = req.body;

  // check if passwords match
  if (password !== confirmPassword) {
    return next(createError('Passwords do not match.', 400));
  }

  // check if user already exists
  const dbUser = await User.find({ where: { username } });
  if (dbUser !== null) {
    return next(createError('Username already exists.', 400));
  }

  // Created salted and hashed password
  const hashedPassword = await bCrypt.hash(password, 10);

  // Create user
  const createdUser = await User.create({
    username,
    name,
    password: hashedPassword,
    isAdmin: false,
    isEnabled: false,
  });

  // respond with id of created user
  res.json({ message: 'User has been successfully created', id: createdUser.id });

});

export default routes;
