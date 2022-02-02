import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ResetPasswordValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    token: schema.string({}, [rules.exists({ table: 'tokens', column: 'token' })]),
    password: schema.string({}, [rules.minLength(8)]),
  });
}
