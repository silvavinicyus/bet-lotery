import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ShowBetValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.number([rules.unsigned(), rules.exists({ table: 'bets', column: 'id' })]),
    }),
  });
}
