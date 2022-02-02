import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Cart from 'App/Models/Cart';
import Game from 'App/Models/Game';
import DestroyBetValidator from 'App/Validators/Bets/DestroyBetValidator';
import ShowBetValidator from 'App/Validators/Bets/ShowBetValidator';
import StoreBetValidator from 'App/Validators/Bets/StoreBetValidator';

export default class BetsController {
  public async store({ auth, request, response }: HttpContextContract) {
    await request.validate(StoreBetValidator);

    const { bets } = request.body();

    let totalValue = 0;

    for await (let bet of bets) {
      // eslint-disable-next-line eqeqeq
      if (bet.userId != auth.user?.id) {
        return response.badRequest({
          error: 'This user does not match with the logged user',
          bet: bet.userId,
          auth: auth.user?.id,
        });
      }
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

    await Bet.createMany(bets);

    await Mail.send((message) => {
      message
        .from('admin@bet.lotery.com')
        .to(auth.user?.email || '')
        .subject('Your bet has been created!')
        .htmlView('emails/newbet', {
          name: auth.user?.name,
          value: totalValue.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
        });
    });

    return response.created(bets);
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
