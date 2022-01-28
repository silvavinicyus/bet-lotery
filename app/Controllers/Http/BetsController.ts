import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreBetValidator);

    const { userId, gameId } = request.params();
    const { numbers } = request.body();

    const bet = new Bet();

    bet.userId = userId;
    bet.gameId = gameId;
    bet.numbers = numbers;

    await bet.save();

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
