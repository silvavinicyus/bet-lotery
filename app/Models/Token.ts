import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public secureId: string;

  @column()
  public user_id: number;

  @column()
  public token: string;

  @column()
  public type: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
