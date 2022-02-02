import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';
import { v4 as uuidV4 } from 'uuid';

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public value: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static createUUID(cart: Cart) {
    cart.id = uuidV4();
  }
}
