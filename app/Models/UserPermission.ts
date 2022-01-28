import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Permission from './Permission';
import User from './User';
import { v4 as uuidV4 } from 'uuid';

export default class UserPermission extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column()
  public permissionId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @beforeCreate()
  public static createUUID(permission: Permission) {
    permission.id = uuidV4();
  }
}
