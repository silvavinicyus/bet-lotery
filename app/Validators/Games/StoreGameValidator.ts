import CustomMessages from '../CustomMessages';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class StoreGameValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    type: schema.string({}, [rules.minLength(4)]),
    description: schema.string({}, [rules.minLength(6)]),
    range: schema.number([rules.range(0, 100)]),
    price: schema.number([rules.range(0, 100)]),
    maxNumber: schema.number([rules.range(0, 100)]),
    color: schema.string({ trim: true }, [rules.minLength(7)]),
  });
}
