import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Game from 'App/Models/Game';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';

interface Ibet {
  userId: string;
  gameId: string;
  value: number;
}

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreBetValidator);

    const { bets } = request.body();

    let totalValue = 0;

    for await (let bet of bets) {
      const { price } = await Game.findOrFail(bet.gameId);
      totalValue += price;
    }

    if (totalValue < 30) {
      return response.badRequest({
        message: 'To make a bet your cart must be at least R$ 30,00',
        totalValue,
      });
    }

    await Bet.createMany(bets);

    return response.created();
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

    const { id } = request.params();

    const bet = await Bet.findOrFail(id);

    await bet.delete();

    return response.noContent();
  }
}
