import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserPermission from 'App/Models/UserPermission';

export default class IsAdmin {
  public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user) {
      return response.unauthorized('User not logged');
    }

    let isAdmin: boolean = false;

    const userPermissions = await UserPermission.query()
      .where('userId', auth.user.id)
      .preload('permission');

    for (let i = 0; i < userPermissions.length; i++) {
      if (userPermissions[i].permission.type === 'admin') {
        isAdmin = true;
      }
    }

    if (isAdmin === false) {
      return response.unauthorized('User not authorized');
    }

    await next();
  }
}
