import { User } from '../../models';
import { createError, hashPassword } from "../../util";

export async function createUser(userData) {
  const { username, name, password } = userData;

  // check if user already exists
  const dbUser = await User.find({ where: { username } });
  if (dbUser !== null) {
    throw createError('Username already exists.', 400);
  }

  // Created salted and hashed password
  const hashedPassword = await hashPassword(password);

  // Create user
  return await User.create({
    username,
    name,
    password: hashedPassword,
    isAdmin: false,
    isEnabled: false,
  });
}
