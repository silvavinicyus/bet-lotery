import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Permission from 'App/Models/Permission';
import CreatePermissionValidator from 'App/Validators/Permissions/CreatePermissionValidator';
import DestroyPermissionValidator from 'App/Validators/Permissions/DestroyPermissionValidator';
import ShowPermissionValidator from 'App/Validators/Permissions/ShowPermissionValidator';
import UpdatePermissionValidator from 'App/Validators/Permissions/UpdatePermissionValidator';

export default class PermissionsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreatePermissionValidator);

    const { type } = request.body();

    const permission = new Permission();

    permission.type = type;

    await permission.save();

    return response.created();
  }

  public async index() {
    const permissions = await Permission.query();

    return permissions;
  }

  public async show({ request }: HttpContextContract) {
    await request.validate(ShowPermissionValidator);

    const { id } = request.params();

    const permission = await Permission.findOrFail(id);

    return permission;
  }

  public async destroy({ request, response }: HttpContextContract) {
    await request.validate(DestroyPermissionValidator);

    const { id } = request.params();

    const permission = await Permission.findOrFail(id);

    await permission.delete();

    return response.noContent();
  }

  public async update({ request }: HttpContextContract) {
    await request.validate(UpdatePermissionValidator);

    const { id } = request.params();
    const { type } = request.body();

    const permission = await Permission.findOrFail(id);

    permission.type = type;

    await permission.save();

    return permission;
  }
}
