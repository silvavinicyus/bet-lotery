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

    return response.created();
  }

  public async index() {
    const games = await Game.query();

    return games;
  }

  public async getById({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const game = await Game.find(id);

    if (!game) {
      return response.notFound({ message: 'There is no game with the given id' });
    }

    return game;
  }

  public async deleteById({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const game = await Game.find(id);

    if (!game) {
      return response.notFound({ message: 'There is no game with the given id' });
    }

    await game.delete();

    return response.noContent();
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { type, description, range, price, maxNumber, color } = request.body();

    const game = await Game.find(id);

    if (!game) {
      return response.notFound({ message: 'There is no game with the given id' });
    }

    type ? (game.type = type) : '';
    description ? (game.description = description) : '';
    range ? (game.range = range) : '';
    price ? (game.price = price) : '';
    maxNumber ? (game.maxNumber = maxNumber) : '';
    color ? (game.color = color) : '';

    await game.save();

    return response.json(game);
  }
}
