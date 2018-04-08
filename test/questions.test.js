import request from 'supertest';
import app from '../src/app.js';

describe('GET /questions', () => {
  it('should return json', async () => {
    await request(app)
      .get('/questions')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');
  });
});
