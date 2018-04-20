import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models';

let testAdmin;
let adminToken = '';

let testUser;
let userToken = '';

beforeAll(async () => {

  // create password hash
  const password = await bcrypt.hash('123456', 10);

  // Create admin
  const admin = await User.create({
    username: 'testAdmin',
    name: 'testAdmin',
    password,
    isEnabled: true,
    isAdmin: true,
  });
  testAdmin = admin;

  // Create user
  const user = await User.create({
    username: 'testUser',
    name: 'testUser',
    password,
    isEnabled: true,
    isAdmin: false,
  });
  testUser = user;

  // login with the admin account
  const { body: { token } } = await request(app)
    .post('/login')
    .send({ username: 'testAdmin', password: '123456' })
    .expect(200);
  adminToken = token;

  // login with the user account
  const { body: { token: secondToken } } = await request(app)
    .post('/login')
    .send({ username: 'testUser', password: '123456' })
    .expect(200);
  userToken = secondToken;
});

describe('GET /users', () => {
  it('should should return 401 without admin permissions', async () => {
    await request(app)
      .get('/users')
      .expect(401);
  });

  it('should return a list of users', async () => {
    const { body: users } = await request(app)
      .get('/users')
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (users.length <= 0) {
      throw new Error('Get /users returned no users');
    }
  });
});

describe('GET /users/:userId', () => {
  it('should should return 401 without admin permissions', async () => {
    await request(app)
      .get(`/users/${testUser.id}`)
      .expect(401);
  });

  it('should return a user', async () => {
    const { body: user } = await request(app)
      .get(`/users/${testUser.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (user.id !== testUser.id) {
      throw new Error(`the returned user did not match the requested user.`);
    }
  });
});

describe('PUT /users/:userId', () => {
  it('should should return 401 without admin permissions', async () => {
    await request(app)
      .put(`/users/${testUser.id}`)
      .expect(401);
  });

  it('should return 401 if the requesting user is not the owner', async () => {
    await request(app)
      .put(`/users/${testAdmin.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);
  });

  it('should update all fields', async () => {
    const userUpdate = {
      username: 'KeineAhnung2',
      name: 'Nico2',
      isEnabled: false,
    };

    const { body: updateResponse } = await request(app)
      .put(`/users/${testUser.id}`)
      .send(userUpdate)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (userUpdate.username !== updateResponse.username) {
      throw new Error('username did not match');
    }

    if (userUpdate.name !== updateResponse.name) {
      throw new Error('name did not match');
    }

    if (userUpdate.isEnabled !== updateResponse.isEnabled) {
      throw new Error('isEnabled did not match');
    }
  });

  it('owner can update own data', async () => {
    const userUpdate = {
      username: 'KeineAhnung2',
      name: 'Nico2',
      isEnabled: false,
    };

    await request(app)
      .put(`/users/${testUser.id}`)
      .send(userUpdate)
      .set('authorization', `bearer ${userToken}`)
      .expect(200);
  });
});

describe('DELETE /users/:userId', () => {
  it('should should return 401 without admin permissions', async () => {
    await request(app)
      .delete(`/users/${testUser.id}`)
      .expect(401);
  });


  it('should delete a user', async () => {
    const { body: { id } } = await request(app)
      .post('/register')
      .send({ username: 'test', name: 'test', password: 'test', confirmPassword: 'test' })
      .expect(200);

    await request(app)
      .delete(`/users/${id}`)
      .set('authorization', `bearer ${adminToken}`);
  });
});

afterAll(async () => {
  await testAdmin.destroy();
  await testUser.destroy();
});
