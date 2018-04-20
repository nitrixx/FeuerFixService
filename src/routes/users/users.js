import { Router } from 'express';
import { User, Answer, AnsweredQuestion } from '../../models';
import { validate } from 'express-jsonschema';
import { userUpdate as userUpdateSchema } from '../../schema';
import { hashPassword } from '../../util';
import {
  userNotFound,
  passwordsDoNotmatch,
  forbidden,
  adminOrOwnerOnly,
} from '../../commonErrors';

const routes = Router();

routes.param('userId', async (req, res, next, userId) => {
  const { id: requestingUserId, isAdmin } = req.user;

  if (!isAdmin && parseInt(userId, 10) !== requestingUserId) {
    return next(adminOrOwnerOnly);
  }

  req.dbUser = await User.findById(userId, {
    attributes: [ 'id', 'username', 'name', 'isAdmin', 'isEnabled', 'createdAt', 'updatedAt' ],
    include: [ Answer ],
  });
  return next();
});

routes.get('/', async (req, res, next) => {
  const { isAdmin } = req.user;

  if(!isAdmin) {
    return next(forbidden);
  }

  const users = await User.findAll({
    attributes: [ 'id', 'username', 'isAdmin', 'isEnabled' ],
  });
  res.json({ users });
});

routes.get('/:userId', async (req, res) => {
  const { dbUser: user } = req;
  res.json(user);
});

routes.put('/:userId', validate({ body: userUpdateSchema }), async (req, res, next) => {
  const { userId: userIdToUpdate } = req.params;
  const { id: requestingUserId, isAdmin } = req.user;
  const {
    username = '',
    name = '',
    isEnabled = '',
    newPassword = '',
    confirmPassword = '',
  } = req.body;

  try {
    // Only the admin or the owner can update a user
    if (!isAdmin && parseInt(userIdToUpdate, 10) !== requestingUserId) {
      return next(adminOrOwnerOnly);
    }

    // Get the user model from the db
    const dbUser = await User.findById(userIdToUpdate);
    if (!dbUser) {
      return next(userNotFound);
    }

    // Check if the password has to be updated
    let shouldUpdatePassword = false;
    let updatedPassword = '';
    if (newPassword !== '') {
      // Check that both passwords match
      if (newPassword !== confirmPassword) {
        return next(passwordsDoNotmatch);
      }

      shouldUpdatePassword = true;
      updatedPassword = await hashPassword(newPassword);
    }

    // Update user model
    const replyObj = {};
    if (username !== '') {
      dbUser.username = username;
      replyObj.username = username;
    }
    if (name !== '') {
      dbUser.name = name;
      replyObj.name = name;
    }
    if(isEnabled !== '') {
      dbUser.isEnabled = isEnabled;
      replyObj.isEnabled = isEnabled;
    }
    if (shouldUpdatePassword) {
      dbUser.password = updatedPassword;
      replyObj.message = 'You successfully changed your password';
    }

    // Save the changes to the db
    await dbUser.save();

    res.json(replyObj);
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
  const { userId: UserId } = req.params;
  try {
    const statistics = AnsweredQuestion.findAll({ where: { UserId } });
    await statistics.map(async statistic => await statistic.destroy());
    res.json({ message: 'Success' });
  } catch(err) {
    return next(err);
  }
});

export default routes;
