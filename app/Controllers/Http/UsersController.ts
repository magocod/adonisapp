import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { UserRoleIds, UserRoleNames } from 'App/contants'

import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { page, per_page } = request.qs()
    let p = 1
    let perPage = Env.get('PAGINATION_PAGE_SIZE', '5')

    if (page !== undefined && page !== null) {
      p = page
    }

    if (per_page !== undefined && per_page !== null) {
      perPage = per_page
    }

    const users = await User.query().paginate(p, perPage)
    return response.status(200).json({
      data: users.toJSON(),
      message: 'successful operation',
    })
  }

  public async store({ request, response }: HttpContextContract) {
    // don't catch exception
    const validation = await request.validate({
      schema: User.create_rules,
    })

    try {
      const userInstance = await User.create({
        ...validation,
        status: true,
        is_active: true,
      })
      await userInstance.related('roles').attach([UserRoleIds.USER])

      const userResponse = await User.query()
        .where('id', userInstance.id)
        .apply((scopes) => scopes.allRelationships())
        .first()

      return response.status(201).json({
        message: 'Registered user',
        data: userResponse,
      })
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Error registering user',
        details: '',
        err_message: error.message,
      })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const userInstance = await User.findOrFail(params.id)
      const userResponse = await User.query()
        .where('id', userInstance.id)
        .apply((scopes) => scopes.allRelationships())
        .first()

      return response.status(200).json({
        message: 'Successful operation',
        data: userResponse,
      })
    } catch (error) {
      // console.log(error)
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'User search error',
        details: '',
        err_message: error.message,
      })
    }
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const userInstance = await User.findOrFail(params.id)
    const validation = await request.validate({
      schema: User.updateRules(userInstance.id),
    })

    try {
      const roles = await userInstance.getRolesSlug()

      if (roles.includes(UserRoleNames.ROOT)) {
        return response.status(403).json({
          message: 'You do not have permission to edit this user',
          details: 'Only a root user can modify himself',
          err_message: '',
        })
      }

      const authUser = await auth.authenticate()

      const authRoles = await authUser.getRolesSlug()
      if (roles.includes(UserRoleNames.ADMIN) && !authRoles.includes(UserRoleNames.ROOT)) {
        return response.status(403).json({
          message: 'You do not have permission to edit this user',
          details: 'An administrator user, cannot modify another administrator',
          err_message: '',
        })
      }

      userInstance.email = validation.email
      userInstance.first_name = validation.first_name
      userInstance.last_name = validation.last_name

      await userInstance.save()

      const userResponse = await User.query()
        .where('id', userInstance.id)
        .apply((scopes) => scopes.allRelationships())
        .first()

      return response.status(200).json({
        message: 'Modified user',
        data: userResponse,
      })
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Error modifying user',
        details: '',
        err_message: error.message,
      })
    }
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    try {
      // console.log(params);
      const userInstance = await User.findOrFail(params.id)

      const user = await auth.authenticate()

      // eslint-disable-next-line eqeqeq
      if (user.id == params.id) {
        // you cannot eliminate
        return response.status(403).json({
          message: "You can't delete yourself",
          details: '',
          err_message: '',
        })
      }

      const roles = await userInstance.getRolesSlug()

      if (roles.includes(UserRoleNames.ROOT)) {
        // Cannot delete superusers with http queries
        return response.status(403).json({
          message: 'You do not have permission to delete this user',
          details: 'Cannot remove root users with http queries',
          err_message: '',
        })
      }

      await userInstance.delete()

      return response.status(200).json({
        message: 'User Deleted',
        data: null,
      })
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Error deleting user',
        details: '',
        err_message: error.message,
      })
    }
  }
}
