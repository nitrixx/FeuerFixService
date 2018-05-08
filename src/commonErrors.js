import { createError } from './util';

const passwordsDoNotmatch = createError('Passwords do not match.', 400);
const userNotFound = createError('User not found', 404);
const categoryNotFound = createError('Category not found', 404);
const questionNotFound = createError('Question not found', 404);
const answerNotFound = createError('Answer not found', 404);
const reportNotFound = createError('Report not found', 404);
const accountNotEnabled = createError('Your account has to be activated by an administrator first.', 401);
const forbidden = createError('You are not allowed to call this endpoint', 401);
const adminOrOwnerOnly = createError('Only the admin or the owner of this resource can access it.', 401);

export {
  passwordsDoNotmatch,
  userNotFound,
  categoryNotFound,
  questionNotFound,
  answerNotFound,
  reportNotFound,
  accountNotEnabled,
  forbidden,
  adminOrOwnerOnly,
};
