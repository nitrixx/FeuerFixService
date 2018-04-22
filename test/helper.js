import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import {
  User,
  Category,
  Question,
} from '../src/models';

export async function createTestAdmin(username, password, isEnabled = true) {
  return await createUser(true, username, password, isEnabled);
}

export async function createTestUser(username, password, isEnabled = true) {
  return await createUser(false, username, password, isEnabled);
}

export async function createTestCategory(name) {
  return await Category.create({ name });
}

export async function createTestQuestion(name, CategoryId) {
  return await Question.create({ name, CategoryId });
}

export async function deleteCategoryById(categoryId) {
  const category = await Category.findById(categoryId);
  await category.destroy();
}

export async function deleteUserById(userId) {
  const user = await User.findById(userId);
  await user.destroy();
}

export async function doesCategoryExist(categoryId) {
  const category = await Category.findById(categoryId);
  return !!category;
}

export async function doesQuestionExist(questionId) {
  const question = await Question.findById(questionId);
  return !!question;
}

export async function getToken(username, password) {
  const { body: { token } } = await request(app)
    .post('/login')
    .send({ username, password })
    .expect(200);
  return token;
}

async function createUser(isAdmin, username, password, isEnabled) {
  const passwordHash = await createPasswordHash(password);
  return await User.create({
    username,
    name: username,
    password: passwordHash,
    isEnabled,
    isAdmin,
  });
}

async function createPasswordHash(password) {
  return await bcrypt.hash(password, 10);
}
