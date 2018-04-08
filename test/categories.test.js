import request from 'supertest';
import app from '../src/app.js';

describe('GET /categories', () => {
  it('should return json', async () => {
    await request(app)
      .get('/categories')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });
});
