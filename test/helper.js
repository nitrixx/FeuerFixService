import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import {
  User,
  Category,
  Question,
  Answer,
  AnsweredQuestion,
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

export async function createTestQuestion(text, CategoryId) {
  return await Question.create({ text, CategoryId });
}

export async function createTestAnswer(text, isCorrect, QuestionId) {
  return await Answer.create({ text, isCorrect, QuestionId });
}

export async function createTestStatistic(AnswerId, UserId) {
  return await AnsweredQuestion.create({ UserId, AnswerId });
}

export async function deleteCategoryById(categoryId) {
  const category = await Category.findById(categoryId);
  await category.destroy();
}

export async function deleteUserById(userId) {
  const user = await User.findById(userId);
  await user.destroy();
}

export async function deleteQuestionById(questionId) {
  const question = await Question.findById(questionId);
  await question.destroy();
}

export async function deleteAnswerById(answerId) {
  const answer = await Answer.findById(answerId);
  await answer.destroy();
}

export async function deleteStatisticById(AnswerId, UserId) {
  const statistic = await AnsweredQuestion.findOne({ where: { AnswerId, UserId } });
  await statistic.destroy();
}

export async function isAnswerCorrect(answerId) {
  const answer = await Answer.findById(answerId);
  return answer.isCorrect;
}

export async function doesCategoryExist(categoryId) {
  const category = await Category.findById(categoryId);
  return !!category;
}

export async function doesQuestionExist(questionId) {
  const question = await Question.findById(questionId);
  return !!question;
}

export async function doesAnswerExist(answerId) {
  const answer = await Answer.findById(answerId);
  return !!answer;
}

export async function doesStatisticExist(statisticId) {
  const statistic = await AnsweredQuestion.findById(statisticId);
  return !!statistic;
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
