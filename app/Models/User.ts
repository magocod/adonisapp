import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'

import {
  schema,
  rules,
  validator,
  // DbRowCheckOptions
} from '@ioc:Adonis/Core/Validator'

import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  scope
} from '@ioc:Adonis/Lucid/Orm'

import { AuthCredentials, ModelValidationResult } from '../interfaces';

import Role from 'App/Models/Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public role_id: number

  @column()
  public status: boolean

  @column()
  public is_active: boolean

  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>

  // validations

  /**
   * [loginRules description]
   * 
   * schema user, basic credentiales
   * email, password 
   *
   */
  public static loginRules() {
    return schema.create(
      {
        email: schema.string({}, [
          rules.email()
        ]),
        password: schema.string(),
      }
    )
  }

  /**
   * [validateLogin description]
   *
   * validate user basic credentiales
   * email, password
   *
   * Note: take any exception and return method execution as successful
   *
   */
  public static async validateLogin(values: AuthCredentials): Promise<ModelValidationResult<AuthCredentials>> {
    try {
      const validatedData = await validator.validate({
        schema: this.loginRules(),
        data: values,
      })
      return {
        is_valid: true,
        data: validatedData,
        messages: [],
        exception: '',
      };
    } catch (error) {
      // console.log(error.messages)
      // return error.messages;
      return {
        is_valid: false,
        data: {} as AuthCredentials,
        messages: error.messages,
        exception: error.message,
      };
    }
  }

  /**
   * [updateProfileRules description]
   * 
   * schema user, update profile 
   *
   */
  public static updateProfileRules(userId: number) {
    return schema.create(
      {
        first_name: schema.string(),
        last_name: schema.string(),
        email: schema.string({}, [
          rules.email(),
          rules.unique({
            table: 'users',
            column: 'email',
            whereNot: {
              id: userId
            }
          })
        ])
      }
    )
  }

  /**
   * [scope description]
   * @param {[type]} (query) => {    query.where('publishedOn', '<=', DateTime.utc().toSQLDate())  } [description]
   */
  public static allRelationships = scope((query) => {
    query.preload('roles' as any)
  })

  /**
   * [getRolesSlug description]
   */
  async getRolesSlug() {
    const user = await User.query().where('id', this.id).preload('roles').first()

    if (user === null) {
      return []
    }

    return user.roles.map((role) => {
      return role.slug;
    })

  }

}
