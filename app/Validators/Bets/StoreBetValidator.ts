import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class StoreBetValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    bets: schema.array().members(
      schema.object().members({
        userId: schema.string({}, [rules.uuid(), rules.exists({ table: 'users', column: 'id' })]),
        gameId: schema.string({}, [rules.uuid(), rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.string({ trim: true }, [rules.minLength(8)]),
      })
    ),
  });
}
