import { User, Answer, AnsweredQuestion } from '../../models';
import { hashPassword } from '../../util';
import { userNotFound } from '../../commonErrors';

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

export async function updateUser(userData, dbUser, isRequestUserAdmin) {
  const {
    username = '',
    name = '',
    password = '',
    isEnabled,
    isAdmin,
  } = userData;

  // Check if the password has to be updated
  let shouldUpdatePassword = false;
  let updatedPassword = '';
  if (password !== '') {
    shouldUpdatePassword = true;
    updatedPassword = await hashPassword(password);
  }

  // Update user model
  if (username !== '') {
    dbUser.username = username;
  }
  if (name !== '') {
    dbUser.name = name;
  }
  if (isEnabled !== undefined && isRequestUserAdmin) {
    dbUser.isEnabled = isEnabled;
  }
  if (isAdmin !== undefined && isRequestUserAdmin) {
    dbUser.isAdmin = isAdmin;
  }
  if (shouldUpdatePassword) {
    dbUser.password = updatedPassword;
  }

  // Save the changes to the db
  await dbUser.save();

  return assembleUserUpdateResponse(dbUser, shouldUpdatePassword);
}

export async function deleteStatistics(userId) {
  const statistics = AnsweredQuestion.findAll({ where: { UserId: userId } });
  await Promise.all(statistics // eslint-disable-line no-undef
    .map(async statistic => await statistic.destroy()));
  return { message: 'Success' };
}

function assembleUserUpdateResponse(dbUser, passwordUpdated) {
  const { id, username, name, isEnabled, isAdmin } = dbUser;
  const response = { id, username, name, isEnabled, isAdmin };
  if (passwordUpdated) { response.message = 'You successfully changed your password'; }
  return response;
}
