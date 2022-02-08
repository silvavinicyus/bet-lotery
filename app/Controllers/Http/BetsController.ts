import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Cart from 'App/Models/Cart';
import Game from 'App/Models/Game';
import UserPermission from 'App/Models/UserPermission';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';
import { Kafka } from 'kafkajs';

export default class BetsController {
  public async store({ auth, request, response }: HttpContextContract) {
    await request.validate(StoreBetValidator);

    const { bets } = request.body();

    let totalValue = 0;

    for await (let bet of bets) {
      const { price } = await Game.findOrFail(bet.gameId);
      totalValue += price;
    }

    const { value } = await Cart.firstOrFail();

    const minimumValuToBet: number = value || 30;

    if (totalValue < minimumValuToBet) {
      return response.badRequest({
        message: `R$ ${minimumValuToBet.toLocaleString('pt-br', {
          minimumFractionDigits: 2,
        })} is the minimum amount to`,
        value: totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
      });
    }

    Array.prototype.forEach.call(bets, (bet) => {
      bet['userId'] = auth.user?.id;
    });

    await Bet.createMany(bets);

    const users = await UserPermission.query().preload('permission').preload('user');

    const kafka = new Kafka({
      clientId: 'bet-lotery',
      brokers: ['localhost:9092', 'kafka:29092'],
    });

    const producerNormalUser = kafka.producer();
    const producerAdmin = kafka.producer();

    await producerNormalUser.connect();
    await producerAdmin.connect();

    const message = {
      subject: `New bets from user ${auth.user?.name}`,
      type: 'newBet',
      username: auth.user?.name,
      email: auth.user?.email,
      value: totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
    };

    await producerNormalUser.send({
      topic: 'user_newbet',
      messages: [{ value: JSON.stringify(message) }],
    });

    users.forEach(async (admin) => {
      if (admin.permission.type === 'admin') {
        const messageAdmin = {
          subject: `New bet from user ${auth.user?.name}`,
          type: 'newBetAdmin',
          username: admin.user.name,
          email: admin.user.email,
          value: totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
        };

        await producerAdmin.send({
          topic: 'newbet_admin',
          messages: [{ value: JSON.stringify(messageAdmin) }],
        });
      }
    });

    return response.created({ bets });
  }

  public async index() {
    const bets = await Bet.query().preload('user').preload('game');

    return bets;
  }

  public async show({ request }: HttpContextContract) {
    await request.validate(ShowBetValidator);

    const { id } = request.params();

    const bet = await Bet.query().where('id', id).preload('game').preload('user');

    return bet;
  }

  public async destroy({ request, response }: HttpContextContract) {
    await request.validate(DestroyBetValidator);

    const { id: secureId } = request.params();

    const bet = await Bet.findByOrFail('secure_id', secureId);

    await bet.delete();

    return response.noContent();
  }
}
