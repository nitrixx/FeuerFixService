import request from 'supertest';
import app from '../src/app.js';
import {
  createTestAdmin,
  getToken,
  createTestCategory,
  createTestQuestion,
  createTestUser,
  deleteCategoryById,
  doesCategoryExist,
  doesQuestionExist,
  createTestAnswer,
} from './helper.js';

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

describe('GET /categories', () => {
  it('should return 401 without authorization', async () => {
    await request(app)
      .get('/categories')
      .expect(401);
  });

  it('should return a list of categories', async () => {
    // create a test entry
    const testCategory = await createTestCategory('categoryTestCategory');

    const { body: categories } = await request(app)
      .get('/categories')
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (categories.length <= 0) {
      throw new Error('Get /categories returned no categories');
    }

    // destroy test entry
    await testCategory.destroy();
  });
});

describe('POST /categories', () => {
  it('should return 401 without authorization', async () => {
    await request(app)
      .post('/categories')
      .expect(401);
  });

  it('should return 401 without admin permissions', async () => {
    await request(app)
      .post('/categories')
      .set('authorization', `bearer ${userToken}`)
      .send({ name: 'ThisShouldFail' })
      .expect(401);
  });

  it('should return 400 without a payload containing a name attribute', async () => {
    await request(app)
      .post('/categories')
      .set('authorization', `bearer ${adminToken}`)
      .send({ some: 'data' })
      .expect(400);
  });

  it('should create a category', async () => {
    const { body: { id } } = await request(app)
      .post('/categories')
      .set('authorization', `bearer ${adminToken}`)
      .send({ name: 'categoryCreateTestCategory' })
      .expect(200);
    await deleteCategoryById(id);
  });
});

describe('GET /categories/:categoryId', () => {
  it('should return 401 without authorization', async () => {
    await request(app)
      .get(`/categories/1`)
      .expect(401);
  });

  it('should return a category', async () => {
    // create a test entry
    const testCategory = await createTestCategory('categoryTestGetCategory');

    const { body: category } = await request(app)
      .get(`/categories/${testCategory.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (category.id !== testCategory.id && category.name !== testCategory.name) {
      throw new Error(`the returned category did not match the requested category.`);
    }

    // destroy test entry
    await testCategory.destroy();
  });
});

describe('GET /categories/:categoryId/questions', () => {
  it('should return a list of questions', async () => {
    // create test entries
    const testCategory = await createTestCategory('categoryTestGetQuestions');
    const testQuestion = await createTestQuestion('categoryTestGetQuestions', testCategory.id);
    const testAnswer = await createTestAnswer('categoryTestGetQuestions', true, testQuestion.id);

    const { body: { questions } } = await request(app)
      .get(`/categories/${testCategory.id}/questions`)
      .set('authorization', `bearer ${userToken}`)
      .expect(200);

    if (!questions || questions.length <= 0) {
      throw new Error('did not return questions');
    }

    if (!questions[0].Answers || questions[0].Answers.length <= 0) {
      throw new Error('did not return answers of questions')
    }

    // delete test entries
    await testAnswer.destroy();
    await testQuestion.destroy();
    await testCategory.destroy();
  });
});

describe('DELETE /categories/:categoryId', () => {
  it('should return 401 without authorization', async () => {
    await request(app)
      .delete(`/categories/1`)
      .expect(401);
  });

  it('should return 401 without admin permissions', async () => {
    // create test entry
    const testCategory = await createTestCategory('categoryTestDeleteWithoutPerm');

    await request(app)
      .delete(`/categories/${testCategory.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);

    // destroy test entry
    await testCategory.destroy();
  });

  it('should delete a category including its questions', async () => {
    // create test entries
    const testCategory = await createTestCategory('categoryDeleteTestCategory');
    const testQuestion = await createTestQuestion('categoryDeleteTestQuestion', testCategory.id);

    // delete category
    await request(app)
      .delete(`/categories/${testCategory.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    // test if category still exists
    const categoryPresent = await doesCategoryExist(testCategory.id);
    if (categoryPresent) {
      await testCategory.destroy();
      await testQuestion.destroy();
      throw new Error('Category has not been deleted');
    }

    // test if question still exists
    const questionPresent = await doesQuestionExist(testQuestion.id);
    if (questionPresent) {
      await testCategory.destroy();
      await testQuestion.destroy();
      throw new Error('Question has not been deleted');
    }
  });
});

afterAll(async () => {
  await testAdmin.destroy();
  await testUser.destroy();
});
