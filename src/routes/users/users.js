import { Router } from 'express';
import { User } from '../../models';

const routes = Router();

routes.get('/', async (req, res) => {
  const users = await User.findAll({});
  res.json({ users });
});

export default routes;
