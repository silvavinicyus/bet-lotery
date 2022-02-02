import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Game from 'App/Models/Game';
import DestroyGameValidator from 'App/Validators/Games/DestroyGameValidator';
import ShowGameValidator from 'App/Validators/Games/ShowGameValidator';
import StoreGameValidator from 'App/Validators/Games/StoreGameValidator';
import UpdateGameValidator from 'App/Validators/Games/UpdateGameValidator';

export default class GamesController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreGameValidator);

    const { type, description, range, price, maxNumber, color } = request.body();

    const game = new Game();

    game.type = type;
    game.description = description;
    game.range = range;
    game.price = price;
    game.maxNumber = maxNumber;
    game.color = color;

    await game.save();

    return response.created(game);
  }

  public async index() {
    const games = await Game.query();

    return games;
  }

  public async show({ request }: HttpContextContract) {
    await request.validate(ShowGameValidator);

    const { id } = request.params();

    const game = await Game.find(id);

    return game;
  }

  public async destroy({ request, response }: HttpContextContract) {
    await request.validate(DestroyGameValidator);

    const { id: secureId } = request.params();

    const game = await Game.findByOrFail('secure_id', secureId);

    await game.delete();

    return response.noContent();
  }

  public async update({ request }: HttpContextContract) {
    await request.validate(UpdateGameValidator);

    const { id: secureId } = request.params();
    const { type, description, range, price, maxNumber, color } = request.body();

    const game = await Game.findByOrFail('secure_id', secureId);

    type ? (game.type = type) : '';
    description ? (game.description = description) : '';
    range ? (game.range = range) : '';
    price ? (game.price = price) : '';
    maxNumber ? (game.maxNumber = maxNumber) : '';
    color ? (game.color = color) : '';

    await game.save();

    return game;
  }
}
