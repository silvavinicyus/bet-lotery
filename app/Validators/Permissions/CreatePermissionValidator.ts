import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreatePermissionValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    type: schema.string({ trim: true }, [
      rules.minLength(4),
      rules.unique({ table: 'permissions', column: 'type' }),
    ]),
  });
}
