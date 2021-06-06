import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  scope,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import Role from 'App/Models/Role'
import ApiToken from 'App/Models/ApiToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public status: boolean

  @column()
  public is_active: boolean

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => ApiToken)
  public api_tokens: HasMany<typeof ApiToken>

  /**
   * login validation schema validator
   */
  public static get login_rules() {
    return schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string(),
    })
  }

  /**
   * profile update, validation schema validator
   * @param userId
   */
  public static profileRules(userId: number) {
    return schema.create({
      first_name: schema.string(),
      last_name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
          whereNot: {
            id: userId,
          },
        }),
      ]),
    })
  }

  /**
   *
   */
  public static get create_rules() {
    return schema.create({
      first_name: schema.string(),
      last_name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
        }),
      ]),
      password: schema.string(),
    })
  }

  /**
   *
   * @param userId
   */
  public static updateRules(userId: number) {
    return schema.create({
      first_name: schema.string(),
      last_name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
          whereNot: {
            id: userId,
          },
        }),
      ]),
    })
  }

  /**
   * user profile, preload
   */
  public static allRelationships = scope((query) => {
    query.preload('roles' as any)
  })

  /**
   *
   */
  public async getRolesSlug(): Promise<string[]> {
    const user = await User.query().where('id', this.id).preload('roles').first()

    if (user === null) {
      return []
    }

    return user.roles.map((role) => {
      return role.slug
    })
  }
}
