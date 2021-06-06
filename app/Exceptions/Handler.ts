/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiErrorResponseBody, ApiResponseBody422 } from 'adonis/app'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    // console.log(error)
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json(error.messages as ApiResponseBody422)
    }

    if (error.code === 'FORBIDDEN') {
      return super.handle(error, ctx)
    }

    return ctx.response.status(error.status === undefined ? 400 : error.status).json({
      message: 'Operation failed',
      details: 'general exception catch',
      err_message: error.message,
      // err_stack: error.stack,
    } as ApiErrorResponseBody)

    /**
     * Forward rest of the exceptions to the parent class
     */
    // return super.handle(error, ctx)
  }
}
