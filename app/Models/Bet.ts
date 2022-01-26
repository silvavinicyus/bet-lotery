import { DateTime } from 'luxon';
import { v4 as uuidV4 } from 'uuid';
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Game from './Game';
import User from './User';

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public gameId: string;

  @column()
  public userId: string;

  @column()
  public numbers: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasOne(() => Game)
  public game: HasOne<typeof Game>;

  @hasOne(() => User)
  public user: HasOne<typeof User>;

  @beforeCreate()
  public static createUUID(bet: Bet) {
    bet.id = uuidV4();
  }
}
