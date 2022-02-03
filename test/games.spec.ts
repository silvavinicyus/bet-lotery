import Game from 'App/Models/Game';
import Permission from 'App/Models/Permission';
import User from 'App/Models/User';
import UserPermission from 'App/Models/UserPermission';
import test from 'japa';
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Create Game', (group) => {
  group.before(async () => {
    const admin = new User();
    admin.name = 'User1';
    admin.email = 'admin@bet.lotery.com';
    admin.password = 'secret';
    await admin.save();

    const permission = await Permission.create({
      type: 'admin',
    });

    await UserPermission.create({
      permissionId: permission.id,
      userId: admin.id,
    });
  });

  test('Should be able to create a new game', async (assert) => {
    const game = new Game();

    game.type = 'Alagoas da Sorte';
    game.description =
      'Jogo de apostas característico de alagoas, você ganha ao acertar 8 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 8;
    game.color = '#FBGT65';

    await game.save();

    assert.exists(game.id && game.secureId);
  });

  test('Should no be able to create a new game when some field is missing', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    await request(BASE_URL)
      .post('/games')
      .send({
        type: 'Quina',
        description:
          'Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São 5 sorteios semanais e 5 chance de ganhar.',
        range: -10,
        price: 5,
        color: '#F79B71',
      })
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(422);
  });

  test('Should no be able to create a new game with negative value on range field', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    await request(BASE_URL)
      .post('/games')
      .send({
        type: 'Quina',
        description:
          'Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São 5 sorteios semanais e 5 chance de ganhar.',
        range: -10,
        price: 5,
        maxNumber: 5,
        color: '#F79B71',
      })
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(422);
  });
});

test.group('Show Game', () => {
  test('Should be able to show a single game', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .get(`/games/${game.id}`)
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(200);
  });

  test('Should not be able to show a single game when missing admin token', async () => {
    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL).get(`/games/${game.id}`).expect(401);
  });

  test('Should not be able to show a single game when game id', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    await request(BASE_URL)
      .get(`/games/9565`)
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(422);
  });
});

test.group('Destroy game', () => {
  test('Should be able to delete a game', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .delete(`/games/${game.secureId}`)
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(204);
  });

  test('Should not be able to delete a game when missing admin token', async () => {
    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL).delete(`/games/${game.id}`).expect(401);
  });

  test('Should not be able to felete a game when game id is wrong', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    await request(BASE_URL)
      .delete(`/games/${uuidV4()}`)
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(422);
  });
});

test.group('Update Game', () => {
  test('Should be able to update a game', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .put(`/games/${game.secureId}`)
      .send({
        type: 'Jogo do vinicyus 2',
        description: 'É o jogo em que todo mundo perde sempre',
        range: 5,
        price: 15,
        maxNumber: 2,
      })
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(200);
  });

  test('Should not be able to update a game without admin token', async () => {
    const game = new Game();

    game.type = 'Maceió da Sorte';
    game.description = 'Jogo de apostas característico de Maceió, você ganha ao acertar 6 números.';
    game.range = 60;
    game.price = 5;
    game.maxNumber = 6;
    game.color = '#FBGT65';

    await game.save();

    await request(BASE_URL)
      .put(`/games/${game.secureId}`)
      .send({
        type: 'Jogo do vinicyus 2',
        description: 'É o jogo em que todo mundo perde sempre',
        range: 5,
        price: 15,
        maxNumber: 2,
      })
      .expect(401);
  });

  test('Should not be able to update a game with wrong game id', async () => {
    const { body } = await request(BASE_URL).post('/authenticate').send({
      email: 'admin@bet.lotery.com',
      password: 'secret',
    });

    await request(BASE_URL)
      .put(`/games/${uuidV4()}`)
      .send({
        type: 'Jogo do vinicyus 2',
        description: 'É o jogo em que todo mundo perde sempre',
        range: 5,
        price: 15,
        maxNumber: 2,
      })
      .set({
        Authorization: `Bearer ${body.token.token}`,
      })
      .expect(422);
  });
});
