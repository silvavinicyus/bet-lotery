import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ForgotPasswordValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      secureId: schema.string({}, [
        rules.uuid(),
        rules.exists({ table: 'users', column: 'secure_id' }),
      ]),
    }),
  });
}
