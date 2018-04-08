import request from 'supertest';
import app from '../src/app.js';

describe('GET /', () => {
  it('should redirect to info site', async () => {
    await request(app).get('/').expect(302);
  });
});
