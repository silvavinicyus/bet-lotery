import Cart from 'App/Models/Cart';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
import test from 'japa';
import request from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Bets Creation', (group) => {
  group.before(async () => {});

  test('Should be able to create a new bet', async () => {
    await Cart.create({
      value: 30,
    });

    const userGame = new User();
    userGame.name = 'Vinicyus';
    userGame.email = 'vinicyus11@gmail.com';
    userGame.password = 'secret';
    await userGame.save();

    const { body: userToken } = await request(BASE_URL).post('/authenticate').send({
      email: 'vinicyus11@gmail.com',
      password: 'secret',
    });

    const game = new Game();

    game.type = 'Alagoas da Sorte1111';
    game.description =
      'Jogo de apostas característico de alagoas, você ganha ao acertar 8 números.';
    game.range = 60;
    game.price = 15;
    game.maxNumber = 8;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            userId: userGame.id,
            gameId: game.id,
            numbers: '09, 10, 25, 23, 56, 23',
          },
          {
            userId: userGame.id,
            gameId: game.id,
            numbers: '09, 10, 25, 23, 56, 23',
          },
        ],
      })
      .set({
        Authorization: `Bearer ${userToken.token.token}`,
      })
      .expect(201);
  });

  test('Should not be able to create a new bet when cart value is bellow R$ 30,00', async () => {
    const userGame = new User();
    userGame.name = 'Vinicyus';
    userGame.email = 'vinicyus1111@gmail.com';
    userGame.password = 'secret';
    await userGame.save();

    const { body: userToken } = await request(BASE_URL).post('/authenticate').send({
      email: 'vinicyus1111@gmail.com',
      password: 'secret',
    });

    const game = new Game();

    game.type = 'Alagoas da Sorte1111';
    game.description =
      'Jogo de apostas característico de alagoas, você ganha ao acertar 8 números.';
    game.range = 60;
    game.price = 15;
    game.maxNumber = 8;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            userId: userGame.id,
            gameId: game.id,
            numbers: '09, 10, 25, 23, 56, 23',
          },
        ],
      })
      .set({
        Authorization: `Bearer ${userToken.token.token}`,
      })
      .expect(400);
  });

  test('Should not be able to create a new bet when player token is missing', async () => {
    const userGame = new User();
    userGame.name = 'Vinicyus';
    userGame.email = 'vinicyus11111@gmail.com';
    userGame.password = 'secret';
    await userGame.save();

    const game = new Game();

    game.type = 'Alagoas da Sorte1111';
    game.description =
      'Jogo de apostas característico de alagoas, você ganha ao acertar 8 números.';
    game.range = 60;
    game.price = 15;
    game.maxNumber = 8;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            userId: userGame.id,
            gameId: game.id,
            numbers: '09, 10, 25, 23, 56, 23',
          },
        ],
      })
      .expect(401);
  });
});
