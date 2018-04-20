import { createError } from './util';

const passwordsDoNotmatch = createError('Passwords do not match.', 400);
const userNotFound = createError('User not found', 404);
const accountNotEnabled = createError('Your account has to be activated by an administrator first.', 401);
const forbidden = createError('You are not allowed to call this endpoint', 401);

export { passwordsDoNotmatch, userNotFound, accountNotEnabled, forbidden };
