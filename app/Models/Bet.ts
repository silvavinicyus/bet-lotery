import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidV4 } from 'uuid';
import Game from './Game';
import User from './User';

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public secureId: string;

  @column()
  public gameId: number;

  @column()
  public userId: number;

  @column()
  public numbers: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @beforeCreate()
  public static createUUID(bet: Bet) {
    bet.secureId = uuidV4();
  }
}
