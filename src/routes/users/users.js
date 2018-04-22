import { Router } from 'express';
import { validate } from 'express-jsonschema';
import { userUpdate as userUpdateSchema } from '../../schema';
import { forbidden, adminOrOwnerOnly, } from '../../commonErrors';
import { prefetchUser, getUserList, updateUser, deleteStatistics } from './handler';

const routes = Router();

routes.param('userId', async (req, res, next, userId) => {
  const { id: requestingUserId, isAdmin } = req.user;

  if (!isAdmin && parseInt(userId, 10) !== requestingUserId) {
    return next(adminOrOwnerOnly);
  }

  try {
    req.dbUser = await prefetchUser(userId);
    return next();
  } catch(err) {
    return next(err);
  }
});

routes.get('/', async (req, res, next) => {
  const { isAdmin } = req.user;
  if(!isAdmin) { return next(forbidden); }

  try {
    const users = await getUserList();
    res.json({ users });
  } catch (err) {
    return next(err);
  }
});

routes.get('/:userId', async (req, res) => {
  const { dbUser: user } = req;
  res.json(user);
});

routes.put('/:userId', validate({ body: userUpdateSchema }), async (req, res, next) => {
  const { body, dbUser, user: { isAdmin } } = req;

  try {
    const replyUser = await updateUser(body, dbUser, isAdmin);
    res.json(replyUser);
  } catch (err) {
    return next(err);
  }
});

routes.delete('/:userId', async (req, res) => {
  const { dbUser: user, params: { userId } } = req;
  await user.destroy();
  res.json({ message: `Successfully deleted user with id ${userId}` });
});

routes.delete('/:userId/statistics', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const replyMsg = await deleteStatistics(userId);
    res.json(replyMsg);
  } catch(err) {
    return next(err);
  }
});

export default routes;
