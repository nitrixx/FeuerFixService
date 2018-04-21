import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { createError } from "../../util";

const ONEDAY = 24 * 60 * 60

export async function login(username, password) {
  const loginFail = createError('Username or password wrong', 401);

  // Check if user exists
  const user = await User.findOne({ where: { username } });
  if (!user) { throw loginFail; }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) { throw loginFail; }

  const token = await jwt.sign({
    id: user.id,
    isEnabled: user.isEnabled,
    isAdmin: user.isAdmin,
  }, process.env.JWT_SECRET, { expiresIn: ONEDAY });

  return { userId: user.id, token };
}
