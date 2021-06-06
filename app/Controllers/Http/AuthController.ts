import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { ApiErrorResponseBody, ApiResponseBody } from 'adonis/app'

export default class AuthController {
  /**
   * user authentication (email, password)
   * @param request
   * @param auth
   * @param response
   */
  public async login({ request, auth, response }: HttpContextContract) {
    // don't catch exception
    const validatedData = await request.validate({
      schema: User.login_rules,
    })

    try {
      const userInstance = await User.query()
        .apply((scopes) => scopes.allRelationships())
        .where('email', validatedData.email)
        .first()

      const token = await auth.use('api').attempt(validatedData.email, validatedData.password)
      // return token.toJSON()

      return response.status(200).json({
        message: 'Welcome',
        data: {
          user: userInstance,
          access_token: token,
        },
      } as ApiResponseBody)
    } catch (error) {
      // console.log(error);
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Email or password error',
        details: '',
        err_message: error.message,
      } as ApiErrorResponseBody)
    }
  }

  /**
   *
   * @param auth
   * @param response
   */
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response.status(200).json({
        data: null,
        message: 'Successfully Logged Out',
      } as ApiResponseBody)
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Logout error',
        details: '',
        err_message: error.message,
      } as ApiErrorResponseBody)
    }
  }

  /**
   *
   * @param auth
   * @param response
   */
  public async currentUser({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()

      const userData = await User.query()
        .apply((scopes) => scopes.allRelationships())
        .where('id', user.id)
        .first()

      return response.status(200).json({
        message: 'authenticated user',
        data: userData,
      } as ApiResponseBody)
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Error retrieving user',
        details: '',
        err_message: error.message,
      } as ApiErrorResponseBody)
    }
  }

  /**
   *
   * @param auth
   * @param request
   * @param response
   */
  public async updateProfile({ auth, request, response }: HttpContextContract) {
    const user = await auth.authenticate()

    // don't catch exception
    const validatedData = await request.validate({
      schema: User.profileRules(user.id),
    })

    try {
      user.email = validatedData.email
      user.first_name = validatedData.first_name
      user.last_name = validatedData.last_name
      await user.save()

      const userResponse = await User.query()
        .apply((scopes) => scopes.allRelationships())
        .where('id', user.id)
        .first()

      return response.status(200).json({
        message: 'Updated user profile',
        data: userResponse,
      } as ApiResponseBody)
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: 'Error updating user profile',
        details: '',
        err_message: error.message,
      } as ApiErrorResponseBody)
    }
  }
}
