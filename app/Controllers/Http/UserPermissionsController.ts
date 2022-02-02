import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Permission from 'App/Models/Permission';
import UserPermission from 'App/Models/UserPermission';
import AddPermissionValidator from 'App/Validators/Users/AddPermissionValidator';
import RemovePermissionValidator from 'App/Validators/Users/RemovePermissionValidator';

export default class UserPermissionsController {
  public async addPermission({ request }: HttpContextContract) {
    await request.validate(AddPermissionValidator);

    const { userId } = request.params();
    const { type } = request.body();

    const userPermission = new UserPermission();

    const permission = await Permission.findByOrFail('type', type);

    userPermission.userId = userId;
    userPermission.permissionId = permission.id;

    await userPermission.save();

    return userPermission;
  }

  public async removePermission({ request, response }: HttpContextContract) {
    await request.validate(RemovePermissionValidator);

    const { id } = request.params();

    const userPermission = await UserPermission.findOrFail(id);

    await userPermission.delete();

    return response.noContent();
  }
}
