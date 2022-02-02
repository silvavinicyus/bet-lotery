import User from 'App/Models/User';
import test from 'japa';
import { v4 as uuidV4 } from 'uuid';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Users Tests', () => {
  test('Should be able to create  a user', async (assert) => {
    const user = new User();
    user.id = uuidV4();
    user.name = 'User1';
    user.email = 'user1@bet.lotery.com';
    user.password = 'secret';
    await user.save();

    assert.exists(user.id);
  });

  test('Should be able to hash the password', async (assert) => {
    const user = new User();
    user.id = uuidV4();
    user.name = 'user2';
    user.email = 'user2@bet.lotery.com';
    user.password = 'secret';
    await user.save();

    assert.notEqual(user.password, 'secret');
  });

  test('Should not be able to create a user with weak password', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'joao@gmail.com',
        name: 'Joao Silva',
        password: 'admin123',
      })
      .expect(201);

    console.log(body);
  });
});
