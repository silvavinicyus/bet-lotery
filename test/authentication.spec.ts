import Permission from 'App/Models/Permission';
import User from 'App/Models/User';
import test from 'japa';
import request from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Authentication testes', (group) => {
  group.before(async () => {
    const user5 = new User();
    user5.name = 'user5';
    user5.email = 'user5@bet.lotery.com';
    user5.password = 'secret1';
    await user5.save();
  });

  test('Shoud be able to authenticate', async (assert) => {
    const response = await request(BASE_URL).post('/authenticate').send({
      email: 'user5@bet.lotery.com',
      password: 'secret1',
    });

    assert.equal(response.status, 200);
    assert.notEqual(response.body.token, '');
  });

  test('Shoud not be able to authenticate with wrong password', async (assert) => {
    const response = await request(BASE_URL).post('/authenticate').send({
      email: 'user5@bet.lotery.com',
      password: 'secret2',
    });

    assert.equal(response.status, 400);
  });

  test('Shoud not be able to authenticate with wrong email', async (assert) => {
    const response = await request(BASE_URL).post('/authenticate').send({
      email: 'user56@bet.lotery.com',
      password: 'secret1',
    });

    assert.equal(response.status, 400);
  });
});
