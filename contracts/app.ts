/**
 * unique typing of the app
 */

declare module 'adonis/app' {
  /**
   *
   */
  interface ApiResponseBody {
    message: string
    data: any
  }

  /**
   *
   */
  interface ApiErrorResponseBody {
    message: string
    details: string
    err_message: string
  }

  /**
   *
   */
  interface ApiResponseBody422 {
    errors: any[]
  }

  /**
   *
   */
  interface KnexCount {
    total: number
  }
}
