/**
 *
 */

/**
 *
 */
export interface GenericResponse<I> {
  message: string;
  data: I;
}

/**
 * [GenericResponseData description]
 */
export type GenericResponseData = GenericResponse<any>;

/**
 *
 */
export interface GenericExceptionResponse {
  message: string;
  err_message: string;
  details?: string;
}
