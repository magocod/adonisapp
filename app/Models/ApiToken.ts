import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

export default class ApiToken extends BaseModel {
  public static table = 'api_tokens'

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public token: string

  @column.dateTime({ autoCreate: false })
  public expires_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: false })
  public created_at: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
