import request from 'supertest';
import app from '../src/app.js';
import { createTestUser, deleteUserById } from './helper';

// beforeAll(async () => {

// });

describe('POST /register', () => {
  it('should return 400 without a payload', async () => {
    await request(app)
      .post('/register')
      .expect(400);
  });

  it('should return 400 if passwords do not match', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testRegister',
        name: 'testRegister',
        password: '123456',
        confirmPassword: 'thisisatypo',
      })
      .expect(400);
  });

  it('should return 400 if user already exists', async () => {
    // create test entry
    const testUsername = 'testRegister'
    const testUser = await createTestUser(testUsername, '123456');

    await request(app)
      .post('/register')
      .send({
        username: testUsername,
        name: testUsername,
        password: '123456',
        confirmPassword: '123456',
      })
      .expect(400);

    // destroy test entry
    await testUser.destroy();
  });

  it('should create a user', async () => {
    const testUsername = 'registerTestCreateUser';
    const { body: { id } } = await request(app)
      .post('/register')
      .send({
        username: testUsername,
        name: testUsername,
        password: '123456',
        confirmPassword: '123456',
      })
      .expect(200);

      // Destroy created user
      await deleteUserById(id);
  });
});
