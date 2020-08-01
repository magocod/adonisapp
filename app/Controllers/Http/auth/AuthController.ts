import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class AuthController {

	/**
	 * [login description]
	 * 
	 * user authentication (email, password)
	 *
	 */
	public async login ({ request, auth, response }: HttpContextContract) {
		try {
			const email = request.input('email')
	    const password = request.input('password')

      const userInstance = await User
      .query()
      .where('email', email)
      .first();

	    const token = await auth.use('api').attempt(email, password)
	    // return token.toJSON()

      return response.status(200).json({
        message: 'Bienvenido',
        data: {
          user: userInstance,
          access_token: token
        }
      });

		} catch (error) {
			// console.log(error);
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: "Error en correo electronico o contraseña",
        details: "",
        err_message: error.message
      });
		}
  }

  /**
   * [logout description]
   */
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').logout()
      return response.status(200).json({
        data: null,
        message: 'Se ha Deslogueado Sastifactoriamente'
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error cerrando sesion',
        details: "",
        err_message: error.message
      });
    }
  }

  /**
   * [currentUser description]
   */
  async currentUser({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate();

      const userData = await User
      .query()
      .where('id', user.id)
      .first();

      return response.status(200).json({
        message: "Consulta exitosa, usuario autenticado",
        data: userData
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error recuperando usuario',
        details: "",
        err_message: error.message
      });
    }
  }

}
