import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreBetValidator);

    const { userId, bets } = request.body();

    await Bet.createMany(bets);

    return response.ok({ userId, bets });
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
