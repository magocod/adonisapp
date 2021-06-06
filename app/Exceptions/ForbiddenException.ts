import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example_2
| throw new ForbiddenException()
|
*/
export default class ForbiddenException extends Exception {
  constructor() {
    super('Not allowed', 403, 'FORBIDDEN')
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).json({
      message: 'Access forbidden. You are not allowed to this resource.',
      details: 'current user does not have required role',
      err_message: error.message,
    })
  }
}
