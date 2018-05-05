import request from 'supertest';
import app from '../src/app.js';

import {
  createTestUser,
  getToken,
  createTestCategory,
  createTestQuestion,
  createTestAnswer,
  createTestStatistic,
} from './helper';

let testUser;
let userToken = '';

let testCategory;
let testCategory2;
let testQuestion;
let testAnswerCorrect;
let testAnswerWrong;
let testQuestion2;
let testAnswerCorrect2;
let testAnswerWrong2;
let testQuestion3;
let testAnswerCorrect3;
let testAnswerWrong3;
let testAnsweredQuestion1;
let testAnsweredQuestion2;
let testAnsweredQuestion3;
let testAnsweredQuestion4;
let testAnsweredQuestion5;
let testAnsweredQuestion6;

beforeAll(async () => {
  const userUsername = 'categoryTestUser';
  const userPassword = '123456';
  testUser = await createTestUser(userUsername, userPassword);
  userToken = await getToken(userUsername, userPassword);

  // Create test statistics
  // First test category and questions
  testCategory = await createTestCategory('statisticsTestCategory');

  testQuestion = await createTestQuestion('statisticsTestQuestion', testCategory.id);
  testAnswerCorrect = await createTestAnswer('statisticsTestAnswerCorrect', true, testQuestion.id);
  testAnswerWrong = await createTestAnswer('statisticsTestAnswerWrong', false, testQuestion.id);

  testQuestion2 = await createTestQuestion('statisticsTestQuestion2', testCategory.id);
  testAnswerCorrect2 = await createTestAnswer('statisticsTestAnswerCorrect2', true, testQuestion2.id);
  testAnswerWrong2 = await createTestAnswer('statisticsTestAnswerWrong2', false, testQuestion2.id);

  // second test category and question
  testCategory2 = await createTestCategory('statisticsTestCategory2');

  testQuestion3 = await createTestQuestion('statisticsTestQuestion3', testCategory2.id);
  testAnswerCorrect3 = await createTestAnswer('statisticsTestAnswerCorrect3', true, testQuestion3.id);
  testAnswerWrong3 = await createTestAnswer('statisticsTestAnswerWrong3', false, testQuestion3.id);

  // answered questions
  testAnsweredQuestion1 = await createTestStatistic(testAnswerCorrect.id, testUser.id);
  testAnsweredQuestion2 = await createTestStatistic(testAnswerWrong.id, testUser.id);
  testAnsweredQuestion3 = await createTestStatistic(testAnswerCorrect2.id, testUser.id);
  testAnsweredQuestion4 = await createTestStatistic(testAnswerWrong2.id, testUser.id);
  testAnsweredQuestion5 = await createTestStatistic(testAnswerCorrect3.id, testUser.id);
  testAnsweredQuestion6 = await createTestStatistic(testAnswerWrong3.id, testUser.id);
});

describe('GET /statistics', () => {
  it('should return a statistic for all categories', async () => {
    const { body: { userId, statisticsByCategoryId: stats } } = await request(app)
      .get('/statistics')
      .set('authorization', `bearer ${userToken}`);

    if (userId !== testUser.id) {
      throw new Error(`Wrong userId returned: ${userId}. Expected: ${testUser.id}`);
    }

    if (!stats) {
      throw new Error('Statistics missing');
    }

    if (!stats[testCategory.id] || !stats[testCategory2.id]) {
      throw new Error('Statistics for a category missing');
    }

    if (stats[testCategory.id].correctCount !== 2 || stats[testCategory2.id].correctCount !== 1) {
      throw new Error('Statistics for a category have an incorrect correctCount');
    }

    if (stats[testCategory.id].wrongCount !== 2 || stats[testCategory2.id].wrongCount !== 1) {
      throw new Error('Statistics for a category have an incorrect wrongCount.');
    }
  });
});

describe('GET /statistics/categories/:categoryId', () => {
  it('should return a statistic for all questions of a category', async () => {
    const { body: { userId, statisticsByQuestionId: stats } } = await request(app)
      .get(`/statistics/categories/${testCategory.id}`)
      .set('authorization', `bearer ${userToken}`);

    if (userId !== testUser.id) {
      throw new Error(`Wrong userId returned: ${userId}. Expected: ${testUser.id}`);
    }

    if (!stats) {
      throw new Error('Statistics missing');
    }

    if (!stats[testQuestion.id] || !stats[testQuestion2.id]) {
      throw new Error('Statistics for a question missing');
    }

    if (stats[testQuestion.id].correctCount !== 1 || stats[testQuestion2.id].correctCount !== 1) {
      throw new Error('Statistics for a question have an incorrect correctCount');
    }

    if (stats[testQuestion.id].wrongCount !== 1 || stats[testQuestion2.id].wrongCount !== 1) {
      throw new Error('Statistics for a question have an incorrect wrongCount');
    }
  });
});

describe('GET /statistics/questions/:questionId', () => {
  it('should return a statistic for all answers of a question', async () => {
    const { body: { userId, statisticsByAnswerId: stats } } = await request(app)
      .get(`/statistics/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${userToken}`);

    if (userId !== testUser.id) {
      throw new Error(`Wrong userId returned: ${userId}. Expected: ${testUser.id}`);
    }

    if (!stats) {
      throw new Error('Statistics missing');
    }

    if (!stats[testAnswerCorrect.id] || !stats[testAnswerWrong.id]) {
      throw new Error('Statistics for an answer missing');
    }

    if (stats[testAnswerCorrect.id].count !== 1 || stats[testAnswerWrong.id].count !== 1) {
      throw new Error('Statistics for an answer have the wrong count');
    }
  });
});

afterAll(async () => {
  await testAnsweredQuestion1.destroy();
  await testAnsweredQuestion2.destroy();
  await testAnsweredQuestion3.destroy();
  await testAnsweredQuestion4.destroy();
  await testAnsweredQuestion5.destroy();
  await testAnsweredQuestion6.destroy();
  await testAnswerCorrect3.destroy();
  await testAnswerWrong3.destroy();
  await testQuestion3.destroy();
  await testAnswerCorrect2.destroy();
  await testAnswerWrong2.destroy();
  await testQuestion2.destroy();
  await testAnswerCorrect.destroy();
  await testAnswerWrong.destroy();
  await testQuestion.destroy();
  await testCategory2.destroy();
  await testCategory.destroy();
  await testUser.destroy();
});
