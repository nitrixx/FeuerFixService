import { Router } from 'express';
import { User } from '../../models';
import { validate } from 'express-jsonschema';
import { userUpdate as userUpdateSchema } from '../../schema';

const routes = Router();

routes.get('/', async (req, res) => {
  const users = await User.findAll({});
  res.json({ users });
});

routes.put('/', validate({ body: userUpdateSchema }) ,async (req, res, next) => {
  const { id: userId, isAdmin, isEnabled } = req.user;
  const {
    username ='',
    name = '',
    newPassword = '',
    confirmPassword = '',
  } = req.body;
});

export default routes;
