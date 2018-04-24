import request from 'supertest';
import app from '../src/app.js';
import { createTestUser } from './helper';

describe('POST /login', () => {
  it('should fail if the user does not exist', async () => {
    await request(app)
      .post('/login')
      .send({ username: 'does not exist', password: 'does not matter' })
      .expect(401);
  });

  it('should fail if the password is wrong', async () => {
    // create test entry
    const testUsername = 'logintestuser';
    const testPassword = 'logintestpassword';
    const testUser = await createTestUser(testUsername, testPassword);

    await request(app)
      .post('/login')
      .send({ username: testUsername, password: testPassword + 'margin of error' })
      .expect(401);

    // destroy test entry
    await testUser.destroy();
  });

  it('should fail if the user is not enabled', async () => {
    // create test entry
    const testUsername = 'loginNotEnabledtestuser';
    const testPassword = 'logintestpassword';
    const testUser = await createTestUser(testUsername, testPassword, false);

    await request(app)
      .post('/login')
      .set({ username: testUsername, password: testPassword })
      .expect(400);

    // destroy test entry
    await testUser.destroy();
  });

  it('should return a token', async () => {
    // create test entry
    const testUsername = 'logintestuser';
    const testPassword = 'logintestpassword';
    const testUser = await createTestUser(testUsername, testPassword);

    const { body: loginResponse } = await request(app)
      .post('/login')
      .send({ username: testUsername, password: testPassword })
      .expect(200);

    if (loginResponse.token === undefined) {
      throw new Error(`token missing from response`);
    }

    // destroy test entry
    await testUser.destroy();
  });
});
