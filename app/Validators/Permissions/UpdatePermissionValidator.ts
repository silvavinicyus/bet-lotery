import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdatePermissionValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({}, [
        rules.uuid(),
        rules.exists({ table: 'permissions', column: 'secure_id' }),
      ]),
    }),
    type: schema.string({}, [
      rules.minLength(4),
      rules.unique({ table: 'permissions', column: 'type' }),
    ]),
  });
}
