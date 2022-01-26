import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const { email, name, password } = request.body();

    const userExists = await User.query().where('email', email);

    if (userExists.length > 0) {
      return response.conflict({ message: 'Email already used!' });
    }

    const user = new User();

    user.email = email;
    user.name = name;
    user.password = password;

    await user.save();

    return response.status(201);
  }

  public async index() {
    const users = await User.query();

    return users;
  }

  public async getById({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const userExists = await User.find(id);

    if (!userExists) {
      return response.notFound({ message: 'There is no user with the given id' });
    }

    return userExists;
  }

  public async delete({ request, response }: HttpContextContract) {
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
