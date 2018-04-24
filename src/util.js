import bCrypt from 'bcrypt';

export function createError(message, status) {
  let err = new Error(message);
  err.status = status || 500;
  return err;
}

export function checkEnabledFlag(req, res, next) {
  // This is one of the unprotected routes, skip the check
  if (!req.user) { return next(); }

  const { isEnabled } = req.user;
  if (!isEnabled) {
    const err = createError('Your account has to be activated by an administrator first.', 401);
    return next(err);
  }
  return next();
}

export function containsDuplicates(array) {
  const counts = [];
  for(let i = 0; i <= array.length; i++) {
      if(counts[array[i]] === undefined) {
          counts[array[i]] = 1;
      } else {
          return true;
      }
  }
  return false;
}

export async function hashPassword(passwordToHash) {
  return await bCrypt.hash(passwordToHash, 10);
}
