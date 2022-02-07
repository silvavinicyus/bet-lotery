import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AddPermissionValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      userId: schema.number([rules.unsigned(), rules.exists({ table: 'users', column: 'id' })]),
    }),
    type: schema.string({}, [
      rules.minLength(4),
      rules.exists({ table: 'permissions', column: 'type' }),
    ]),
  });
}
