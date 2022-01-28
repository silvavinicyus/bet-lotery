import CustomMessages from '../CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateGameValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    params: schema.object().members({
      id: schema.string({}, [rules.uuid(), rules.exists({ table: 'games', column: 'id' })]),
    }),
    type: schema.string.optional({}, [rules.minLength(4)]),
    description: schema.string.optional({}, [rules.minLength(6)]),
    range: schema.number.optional([rules.range(0, 100)]),
    price: schema.number.optional([rules.range(0, 100)]),
    maxNumber: schema.number.optional([rules.range(0, 100)]),
    color: schema.string.optional({ trim: true }, [rules.minLength(7)]),
  });
}
