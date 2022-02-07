import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Permission';
import User from 'App/Models/User';
import UserPermission from 'App/Models/UserPermission';
import { v4 as uuidV4 } from 'uuid';

export default class AdminSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run() {
    const uuidAdminPermission = uuidV4();
    const uuidPlayerPermission = uuidV4();

    const permissions = await Permission.createMany([
      {
        secureId: uuidAdminPermission,
        type: 'admin',
      },
      {
        secureId: uuidPlayerPermission,
        type: 'player',
      },
    ]);

    const uuidAdminUser = uuidV4();

    const user = await User.create({
      secureId: uuidAdminUser,
      email: 'admin@bet.lotery.com',
      name: 'admin',
      password: 'admin',
    });

    const uuidUserPermission = uuidV4();

    await UserPermission.create({
      secureId: uuidUserPermission,
      permissionId: permissions[0].id,
      userId: user.id,
    });

    await UserPermission.create({
      secureId: uuidUserPermission,
      permissionId: permissions[1].id,
      userId: user.id,
    });
  }
}
