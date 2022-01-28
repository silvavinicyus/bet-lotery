import CustomMessages from '../CustomMessages';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class UpdateUserValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({}, [rules.uuid(), rules.exists({ table: 'users', column: 'id' })]),
    }),
    email: schema.string.optional({}, [
      rules.email(),
      rules.exists({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    name: schema.string.optional({}, [
      rules.minLength(3),
      rules.alpha({
        allow: ['space'],
      }),
    ]),
  });
}
