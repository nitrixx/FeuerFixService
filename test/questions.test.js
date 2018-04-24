import request from 'supertest';
import app from '../src/app.js';
import { createTestAdmin, getToken, createTestUser, createTestQuestion, createTestCategory, deleteQuestionById, deleteAnswerById, createTestAnswer, isAnswerCorrect, doesQuestionExist, createTestStatistic, doesAnswerExist, doesStatisticExist } from './helper.js';

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

describe('GET /questions', () => {
  it('should should return 401 without authorization', async () => {
    await request(app)
      .get('/questions')
      .expect(401);
  });

  it('should return 401 without admin permissions', async () => {
    await request(app)
      .get('/questions')
      .set('authorization', `bearer ${userToken}`)
      .expect(401);
  });

  it('should return a list of questions', async () => {
    // create a test entry
    const testQuestion = await createTestQuestion('questionsTestQuestion');

    const { body: questions } = await request(app)
      .get('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (questions.length <= 0) {
      throw new Error('Get /questions returned no questions');
    }

    // destroy test entry
    await testQuestion.destroy();
  });
});

describe('GET /questions/:questionId', () => {
  it('should return a question', async () => {
    // create a test entry
    const testQuestion = await createTestQuestion('questionTestGetQuestion');

    const { body: question } = await request(app)
      .get(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (question.id !== testQuestion.id && question.text !== testQuestion.text) {
      throw new Error(`the returned question did not match the requested question.`);
    }

    // destroy test entry
    await testQuestion.destroy();
  });
});

describe('POST /questions', () => {
  it('should return 401 without authorization', async () => {
    await request(app)
      .post('/questions')
      .expect(401);
  });

  it('should return 401 without admin permissions', async () => {
    const body = {
      text: 'This should fail',
      categoryId: 1,
      answers: [{ text: 'testAnswer', isCorrect: true }],
    };
    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${userToken}`)
      .send(body)
      .expect(401);
  });

  it('should return 400 without a payload', async () => {
    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  it('should return 400 with missing text', async () => {
    const body = {
      categoryId: 1,
      answers: [{ text: 'testAnswer', isCorrect: true }],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);
  });

  it('should return 400 with missing categoryId', async () => {
    const body = {
      text: 'This should fail',
      answers: [{ text: 'testAnswer', isCorrect: true }],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);
  });

  it('should return 400 with missing answers', async () => {
    const body = {
      text: 'This should fail',
      categoryId: 1,
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);
  });

  it('should return 400 with no correct answer', async () => {
    // create test entry
    const testCategory = await createTestCategory('questionTestPost');

    const body = {
      text: 'This should fail',
      categoryId: testCategory.id,
      answers: [{ text: 'testAnswer', isCorrect: false }],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);

    // delete test entries
    await testCategory.destroy();
  });

  it('should return 400 with more than one correct answer', async () => {
    // create test entry
    const testCategory = await createTestCategory('questionTestPost');

    const body = {
      text: 'This should fail',
      categoryId: testCategory.id,
      answers: [
        { text: 'testAnswer', isCorrect: true },
        { text: 'testAnswer2', isCorrect: true },
      ],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);

    // delete test entries
    await testCategory.destroy();
  });

  it('should return 400 with identical answer texts', async () => {
    // create test entry
    const testCategory = await createTestCategory('questionTestPost');

    const body = {
      text: 'This should fail',
      categoryId: testCategory.id,
      answers: [
        { text: 'testAnswer', isCorrect: true },
        { text: 'testAnswer', isCorrect: false },
      ],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);

    // delete test entries
    await testCategory.destroy();
  });

  it('should return 400 if question text already exists', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestCategory');
    const testQuestion = await createTestQuestion('questionTestIdenticalText', testCategory.id);

    const body = {
      text: testQuestion.text,
      categoryId: testCategory.id,
      answers: [{ text: 'testAnswer', isCorrect: true }],
    };

    await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(400);

    // destroy test entries
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should create a question with the associated answers', async () => {
    // create test entry
    const testCategory = await createTestCategory('questionsTestCreateQuestions');

    const body = {
      text: 'questionTestCreateQuestion',
      categoryId: testCategory.id,
      answers: [
        { text: 'testAnswer', isCorrect: true },
        { text: 'testAnswer2', isCorrect: false },
      ],
    };

    const { body: { id: questionId, Answers } } = await request(app)
      .post('/questions')
      .set('authorization', `bearer ${adminToken}`)
      .send(body)
      .expect(200);

    if (Answers.length !== body.answers.length) {
      throw new Error('The number of the created answers is not correct.');
    }

    // delete test entries
    await Promise.all(Answers // eslint-disable-line no-undef
      .map(async ({ id }) => await deleteAnswerById(id)));
    await deleteQuestionById(questionId);
    await testCategory.destroy();
  });
});

describe('PUT /questions/:questionId', () => {
  it('should return 401 without admin permissions', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestPut');
    const testQuestion = await createTestQuestion('questionTestPut', testCategory.id);

    await request(app)
      .put(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);

    // delete test entries
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should return 404 if the category does not exist', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestPut');
    const testQuestion = await createTestQuestion('questionTestPut', testCategory.id);

    await request(app)
      .put(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ categoryId: -1 })
      .expect(404);

    // delete test entries
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should return 400 if an answer with an identical text exists', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestPut');
    const testQuestion = await createTestQuestion('questionTestPut', testCategory.id);
    const testAnswer = await createTestAnswer('questionTestPut', true, testQuestion.id);

    await request(app)
      .put(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ answers: [{ text: testAnswer.text, isCorrect: false }] })
      .expect(400);

    // delete test entries
    await testAnswer.destroy();
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should override a former correct answer if a new correct answer is added', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestPut');
    const testQuestion = await createTestQuestion('questionTestPut', testCategory.id);
    const testAnswer = await createTestAnswer('questionTestPut', true, testQuestion.id);

    const { body: { Answers } } = await request(app)
      .put(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ answers: [{ text: 'the new correct answer', isCorrect: true }] })
      .expect(200);

    // check if former answer is now false
    const isFormerCorrectAnswerCorrect = await isAnswerCorrect(testAnswer.id);
    if (isFormerCorrectAnswerCorrect) {
      throw new Error('The new correct answer did not override the old one');
    }

    // delete test entries
    await Promise.all(Answers // eslint-disable-line no-undef
      .map(async ({ id }) => await deleteAnswerById(id)));
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should update all fields of a question', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestPut');
    const testCategory2 = await createTestCategory('questionTestPut2');
    const testQuestion = await createTestQuestion('questionTestPut', testCategory.id);
    const testAnswer = await createTestAnswer('questionTestPut', true, testQuestion.id);

    const updateBody = {
      text: 'questionsPutNewTextTest',
      categoryId: testCategory2.id,
    }

    const { body: question } = await request(app)
      .put(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .send(updateBody)
      .expect(200);

    if (question.CategoryId !== updateBody.categoryId) {
      throw new Error('Category has not been updated');
    }

    if (question.text !== updateBody.text) {
      throw new Error('Text has not been updated');
    }

    // delete test entries
    await testAnswer.destroy();
    await testQuestion.destroy();
    await testCategory.destroy();
    await testCategory2.destroy();
  });
});

describe('DELETE /questions/:questionId', () => {
  it('should return 401 without admin permissions', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestDelete');
    const testQuestion = await createTestQuestion('questionTestDelete', testCategory.id);

    await request(app)
      .delete(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);

    // delete test entries
    await testQuestion.destroy();
    await testCategory.destroy();
  });

  it('should delete a question', async () => {
    // create test entries
    const testCategory = await createTestCategory('questionTestDelete');
    const testQuestion = await createTestQuestion('questionTestDelete', testCategory.id);
    const testAnswer = await createTestAnswer('questionTestDelete', true, testQuestion.id);
    const testStatistic = await createTestStatistic(testAnswer.id, testUser.id);

    await request(app)
      .delete(`/questions/${testQuestion.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    const statisticStillExists = await doesStatisticExist(testStatistic.id);
    if (statisticStillExists) {
      throw new Error('statistic was not deleted');
    }

    const answerStillExists = await doesAnswerExist(testAnswer.id);
    if (answerStillExists) {
      throw new Error('answer was not deleted');
    }

    const questionStillExists = await doesQuestionExist(testQuestion.id);
    if (questionStillExists) {
      throw new Error('question was not deleted');
    }

    // delete test entries
    await testStatistic.destroy();
    await testAnswer.destroy();
    await testQuestion.destroy();
    await testCategory.destroy();
  });
})

afterAll(async () => {
  await testAdmin.destroy();
  await testUser.destroy();
});
