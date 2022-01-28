import Hash from '@ioc:Adonis/Core/Hash';
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidV4 } from 'uuid';
import Bet from './Bet';
import UserPermission from './UserPermission';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public email: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>;

  @hasMany(() => UserPermission)
  public userPermissions: HasMany<typeof UserPermission>;

  @beforeCreate()
  public static async hashPassword(user: User) {
    user.password = await Hash.make(user.password);
  }

  @beforeCreate()
  public static createUUID(user: User) {
    user.id = uuidV4();
  }
}
