const request = require('supertest');
const app = require('./app');

it('GET /animals', async () => {
  const res = await request(app).get('/animals');

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
