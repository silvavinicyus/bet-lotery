import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Cart from 'App/Models/Cart';
import Game from 'App/Models/Game';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
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
        message: `R$ ${minimumValuToBet} is the minimum amount to`,
        value: totalValue,
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
