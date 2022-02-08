import Permission from 'App/Models/Permission';
import User from 'App/Models/User';
import test from 'japa';
import request from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Users Tests', () => {
  test('Should be able to create  a user', async (assert) => {
    const user1 = new User();
    user1.name = 'User1';
    user1.email = 'user1@bet.lotery.com';
    user1.password = 'secret';
    await user1.save();

    assert.exists(user1.id);
  });

  test('Should be able to hash the password', async (assert) => {
    const user2 = new User();
    user2.name = 'user2';
    user2.email = 'user2@bet.lotery.com';
    user2.password = 'secret1';
    await user2.save();

    assert.notEqual(user2.password, 'secret1');
  });
});

test.group('User tests with supertest', (group) => {
  group.before(async () => {
    await Permission.create({
      type: 'player',
    });
  });

  test('Should not be able to create a user with weak password', async () => {
    await request(BASE_URL)
      .post('/users')
      .send({
        email: 'joao1@gmail.com',
        name: 'Joao Silva',
        password: '123',
      })
      .expect(422);
  });

  test('Should not be able to create two users with the same email', async () => {
    await request(BASE_URL)
      .post('/users')
      .send({
        email: 'joao12@gmail.com',
        name: 'Joao Silva Silva',
        password: 'novasenha',
      })
      .expect(201);

    await request(BASE_URL)
      .post('/users')
      .send({
        email: 'joao12@gmail.com',
        name: 'Joao Silva',
        password: 'novasenha1',
      })
      .expect(422);
  });

  test('Should not be able to create a user with wrong email format', async () => {
    await request(BASE_URL)
      .post('/users')
      .send({
        email: 'joao121gmail.com',
        name: 'Joao Silva Silva',
        password: 'novasenha',
      })
      .expect(422);
  });
});
