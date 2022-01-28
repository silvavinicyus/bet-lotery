import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
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
}
