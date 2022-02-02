import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Permission from 'App/Models/Permission';
import User from 'App/Models/User';
import UserPermission from 'App/Models/UserPermission';
import DestroyUserValidator from 'App/Validators/Users/DestroyUsersValidator';
import ShowUserValidator from 'App/Validators/Users/ShowUserValidator';
import StoreUserValidator from 'App/Validators/Users/StoreUserValidator';
import UpdateUserValidator from 'App/Validators/Users/UpdateUserValidator';

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

      const permission = await Permission.findByOrFail('type', 'player');

      await UserPermission.create({
        userId: user.id,
        permissionId: permission.id,
      });

      await Mail.send((message) => {
        message
          .from('admin@bet.lotery.com')
          .to(user.email)
          .subject('Welcome to Bet Lotery!')
          .htmlView('emails/newuser', { name: user.name });
      });

      return response.created(user);
    } catch (error) {
      response.handleError({
        status: error.status || 400,
        message: 'Falha na criação do usuário',
        error: error.message,
      });
    }
  }

  public async index() {
    const users = await User.query().preload('bets').preload('userPermissions');

    return users;
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params();

    await request.validate(ShowUserValidator);

    const userExists = await User.query()
      .where('id', id)
      .preload('bets')
      .preload('userPermissions', (permissions) => {
        permissions.preload('permission');
      });

    return userExists;
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id: secureId } = request.params();

    await request.validate(DestroyUserValidator);

    const userExists = await User.findByOrFail('secure_id', secureId);

    await userExists.delete();

    return response.noContent();
  }

  public async update({ request }: HttpContextContract) {
    const { id: secureId } = request.params();

    const { email, name } = request.body();

    await request.validate(UpdateUserValidator);

    const userExists = await User.findByOrFail('secureId', secureId);

    email ? (userExists.email = email) : '';

    name ? (userExists.name = name) : '';

    await userExists.save();

    return userExists;
  }
}
