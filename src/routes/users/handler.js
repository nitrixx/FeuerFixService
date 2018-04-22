import { User, Answer, AnsweredQuestion } from '../../models';
import { hashPassword } from '../../util';
import { userNotFound, passwordsDoNotmatch } from '../../commonErrors';

export async function prefetchUser(userId) {
  const user = await User.findById(userId, {
    attributes: ['id', 'username', 'name', 'isAdmin', 'isEnabled', 'createdAt', 'updatedAt'],
    include: [Answer],
  });

  if (!user) {
    throw userNotFound;
  }

  return user;
}

export async function getUserList() {
  const users = await User.findAll({
    attributes: ['id', 'username', 'isAdmin', 'isEnabled'],
  });

  return users;
}

export async function updateUser(userData, dbUser) {
  const {
    username = '',
    name = '',
    isEnabled = '',
    newPassword = '',
    confirmPassword = '',
  } = userData;

  // Check if the password has to be updated
  let shouldUpdatePassword = false;
  let updatedPassword = '';
  if (newPassword !== '') {
    // Check that both passwords match
    if (newPassword !== confirmPassword) {
      throw passwordsDoNotmatch;
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
  if (isEnabled !== '') {
    dbUser.isEnabled = isEnabled;
    replyObj.isEnabled = isEnabled;
  }
  if (shouldUpdatePassword) {
    dbUser.password = updatedPassword;
    replyObj.message = 'You successfully changed your password';
  }

  // Save the changes to the db
  await dbUser.save();

  return replyObj;
}

export async function deleteStatistics(userId) {
  const statistics = AnsweredQuestion.findAll({ where: { UserId: userId } });
  await statistics.map(async statistic => await statistic.destroy());
  return { message: 'Success' };
}
