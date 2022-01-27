import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Game from 'App/Models/Game';
import User from 'App/Models/User';

export default class BetsController {
  public async store({ request, response }: HttpContextContract) {
    const { userId, gameId } = request.params();
    const { numbers } = request.body();

    const userExists = await User.find(userId);
    const gameExists = await Game.find(gameId);

    if (!userExists) {
      return response.notFound({ message: 'There is no user with the given id' });
    }

    if (!gameExists) {
      return response.notFound({ message: 'There is no game with the given id' });
    }

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
