import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Game from 'App/Models/Game';

export default class GamesController {
  public async create({ request, response }: HttpContextContract) {
    const { type, description, range, price, maxNumber, color } = request.body();

    const game = new Game();

    game.type = type;
    game.description = description;
    game.range = range;
    game.price = price;
    game.maxNumber = maxNumber;
    game.color = color;

    await game.save();

    return response.status(201);
  }
}
