import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import StoreUserValidator from 'App/Validators/Users/StoreUsersValidator';
import ShowUserValidator from 'App/Validators/Users/ShowUserValidator';
import DestroyUserValidator from 'App/Validators/Users/DestroyUsersValidator';
import UpdateUserValidator from 'App/Validators/Users/UpdateUsersValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const { email, name, password } = request.body();

    await request.validate(StoreUserValidator);

    try {
      const user = new User();

      user.email = email;
      user.name = name;
      user.password = password;

      await user.save();

      return response.created();
    } catch (error) {
      response.handleError({
        status: error.status || 400,
        message: 'Falha na criação do usuário',
        error: error.message,
      });
    }
  }

  public async index() {
    const users = await User.query();

    return users;
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params();

    await request.validate(ShowUserValidator);

    const userExists = await User.find(id);

    return userExists;
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();

    await request.validate(DestroyUserValidator);

    const userExists = await User.findOrFail(id);

    await userExists.delete();

    return response.noContent();
  }

  public async update({ request }: HttpContextContract) {
    const { id } = request.params();

    const { email, name } = request.body();

    await request.validate(UpdateUserValidator);

    const userExists = await User.findOrFail(id);

    email ? (userExists.email = email) : '';

    name ? (userExists.name = name) : '';

    await userExists.save();

    return userExists;
  }
}
