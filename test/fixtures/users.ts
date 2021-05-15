import { UserFactory } from 'Database/factories'
import { UserRoleIds } from '../common'
import Application from '@ioc:Adonis/Core/Application'

/**
 * - password -> 123
 * - is_active -> true
 * - status -> true
 * @param roleIds default [UserRoleIds.User]
 */
export async function generate_user(roleIds = [UserRoleIds.USER]) {
  const user = await UserFactory.merge({
    is_active: true,
    status: true,
    password: '123',
  })
    // .with('api_tokens', 1)
    .create()
  await user.related('roles').attach(roleIds)

  // const chanceFaker = Application.container.use('ChanceFaker')
  // console.log(ChanceFaker)

  // const token = await ApiTokenFactory.make()
  // await user.related('api_tokens').save(token)
  // console.log(token.toJSON())

  const ctx = Application.container.use('Adonis/Core/HttpContext').create('/', {})
  const token = await ctx.auth.use('api').attempt(user.email, '123')
  // console.log(token)

  // ...other
  return { user, token }
}
