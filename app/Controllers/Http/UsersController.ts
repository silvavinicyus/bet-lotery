import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/Users/CreateUsersValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const { email, name, password } = request.body();

    // await request.validate(CreateUserValidator);

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

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const userExists = await User.find(id);

    if (!userExists) {
      return response.notFound({ message: 'There is no user with the given id' });
    }

    return userExists;
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const userExists = await User.find(id);

    if (!userExists) {
      return response.notFound({ message: 'There is no user with the given id' });
    }

    await userExists.delete();

    return response.noContent();
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const { email, name } = request.body();

    const userExists = await User.find(id);

    if (!userExists) {
      return response.notFound({ message: 'There is no user with the given id' });
    }

    if (email) {
      const emailUsed = await User.query().where('email', email);

      if (emailUsed.length > 0 && email !== userExists.email) {
        return response.conflict({ message: 'Email already used!' });
      }

      userExists.email = email;
    }

    name ? (userExists.name = name) : '';

    await userExists.save();

    return userExists;
  }
}
