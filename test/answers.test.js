import request from 'supertest';
import app from '../src/app.js';
import { createTestAnswer, createTestAdmin, getToken, createTestUser, createTestQuestion, isAnswerCorrect, createTestStatistic, doesStatisticExist, doesAnswerExist } from './helper.js';

let testAdmin;
let adminToken = '';

let testUser;
let userToken = '';

beforeAll(async () => {
  const adminUsername = 'categoryTestAdmin';
  const adminPassword = '123456';
  testAdmin = await createTestAdmin(adminUsername, adminPassword);
  adminToken = await getToken(adminUsername, adminPassword);

  const userUsername = 'categoryTestUser';
  const userPassword = '123456';
  testUser = await createTestUser(userUsername, userPassword);
  userToken = await getToken(userUsername, userPassword);
});

describe('PUT /answers/:answerId', () => {

  it('should return 401 without admin permissions', async () => {
    // create test entry
    const testAnswer = await createTestAnswer('answerTestPut', true, undefined);

    await request(app)
      .put(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${userToken}`)
      .send({ text: 'This should fail' })
      .expect(401);

    // destroy test entry
    await testAnswer.destroy();
  });

  it('should return 404 if the question to be associated is not found', async () => {
    // create test entry
    const testAnswer = await createTestAnswer('answerTestPut', true, undefined);

    await request(app)
      .put(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ questionId: -1 })
      .expect(404);

    // destroy test entry
    await testAnswer.destroy();
  });

  it('should update the associated question', async () => {
    // create test entry
    const testQuestion = await createTestQuestion('answerTestPut');
    const testQuestion2 = await createTestQuestion('answerTestPut2');
    const testAnswer = await createTestAnswer('answerTestPut', true, testQuestion.id);

    const { body: { QuestionId } } = await request(app)
      .put(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ questionId: testQuestion2.id })
      .expect(200);

    if(!QuestionId || QuestionId !== testQuestion2.id) {
      throw new Error('Associated question has not been updated');
    }

    // destroy test entry
    await testAnswer.destroy();
    await testQuestion.destroy();
    await testQuestion2.destroy();
  });

  it('should return 400 if the last correct answer is made incorrect', async () => {
    // create test entry
    const testQuestion = await createTestQuestion('answerTestPut');
    const testAnswer = await createTestAnswer('answerTestPut', true, testQuestion.id);

    await request(app)
      .put(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ isCorrect: false })
      .expect(400);

    // destroy test entry
    await testAnswer.destroy();
    await testQuestion.destroy();
  });

  it('should make the former correct answer incorrect', async () => {
    // create test entry
    const testQuestion = await createTestQuestion('answerTestPut');
    const testAnswer = await createTestAnswer('answerTestPut', true, testQuestion.id);
    const testAnswer2 = await createTestAnswer('answerTestPut', false, testQuestion.id);

    await request(app)
      .put(`/answers/${testAnswer2.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ isCorrect: true })
      .expect(200);

    const isFormerCorrectAnswerCorect = await isAnswerCorrect(testAnswer.id);
    if (isFormerCorrectAnswerCorect) {
      throw new Error('Former correct answer has not been made incorrect');
    }

    // destroy test entry
    await testAnswer.destroy();
    await testAnswer2.destroy();
    await testQuestion.destroy();
  });
});

describe('DELETE /answers/:answerId', () => {
  it('should return 401 without admin permissions', async () => {
    // create test entry
    const testAnswer = await createTestAnswer('answerTestPut', true, undefined);

    await request(app)
      .delete(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);

    // destroy test entry
    await testAnswer.destroy();
  });

  it('should delete the answers including the associated statistics', async () => {
    // create test entry
    const testAnswer = await createTestAnswer('answerTestPut', true, undefined);
    const testStatistic = await createTestStatistic(testAnswer.id, testUser.id);

    await request(app)
      .delete(`/answers/${testAnswer.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    const statisticStillExists = await doesStatisticExist(testStatistic.id);
    if(statisticStillExists) {
      throw new Error('statistics have not been deleted');
    }

    const answerStillExists = await doesAnswerExist(testAnswer.id);
    if(answerStillExists) {
      throw new Error('answer has not been deleted');
    }

    // destroy test entry
    await testStatistic.destroy();
    await testAnswer.destroy();
  });
});

afterAll(async () => {
  await testAdmin.destroy();
  await testUser.destroy();
});
