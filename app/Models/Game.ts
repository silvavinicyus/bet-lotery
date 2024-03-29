import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidV4 } from 'uuid';

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public secureId: string;

  @column()
  public type: string;

  @column()
  public description: string;

  @column()
  public range: number;

  @column()
  public price: number;

  @column()
  public maxNumber: number;

  @column()
  public color: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static createUUID(game: Game) {
    game.secureId = uuidV4();
  }
}
