import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { ExceptionResponse } from '../interfaces';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
| @example_2
| throw new UnAuthorizedException('Not allowed')
|
*/
export default class UnAuthorizedException extends Exception {
  constructor (message: string) {
    super(message, 401)
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle (error: this, { response }: HttpContextContract) {
    response
      .status(403)
      .json({
      	message: 'Access forbidden. You are not allowed to this resource.',
      	err_message: error.message,
      } as ExceptionResponse)
  }
}
