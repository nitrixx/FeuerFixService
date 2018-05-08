import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import {
  User,
  Category,
  Question,
  Answer,
  AnsweredQuestion,
  Report,
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

export async function createTestReport(QuestionId, message) {
  return await Report.create({ message, QuestionId });
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
  const statistics = await AnsweredQuestion.findAll({ where: { AnswerId, UserId } });
  await Promise.all(statistics.map(async statistic => await statistic.destroy())); // eslint-disable-line no-undef
}

export async function deleteReportsOfQuestion(questionId) {
  const question = await Question.findById(questionId, { include: [Report] });
  return await Promise.all( // eslint-disable-line no-undef
    question.Reports.map(async report => await report.destroy()));
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

export async function doesReportExist(reportId) {
  const report = await Report.findById(reportId);
  return !!report;
}

export async function doesQuestionHaveReports(questionId) {
  const question = await Question.findById(questionId, { include: [Report] });
  return question.Reports.length > 0;
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
