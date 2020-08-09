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

    // don't catch exception
    const validatedData = await request.validate({
      schema: User.loginRules(),
    })

		try {

      // const validatedData = await User.validateLogin(request.only(['email', 'password']));
      // // console.log(validatedData);

      // if (!validatedData.is_valid) {
      //   return response.status(422).json({
      //     errors: validatedData.messages,
      //     exception: validatedData.exception,
      //   });
      // }
      // return validatedData;

      const userInstance = await User
      .query()
      .where('email', validatedData.email)
      .first();

	    const token = await auth.use('api').attempt(
        validatedData.email,
        validatedData.password
      );
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

  /**
   * [updateProfile description]
   */
  async updateProfile({ auth, request, response }: HttpContextContract) {

    const user = await auth.user;

    if (user === undefined) {
      return response.status(401);
    }

    // don't catch exception
    const validatedData = await request.validate({
      schema: User.updateProfileRules(user.id),
    })

    try {

      user.email = validatedData.email;
      user.first_name = validatedData.first_name;
      user.last_name = validatedData.last_name;
      await user.save();

      const userResponse = await User
      .query()
      .where('id', user.id)
      .first();

      return response.status(200).json({
        message: "Perfil de usuario actualizado",
        data: userResponse
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error actualizando perfil de usuario',
        details: "",
        err_message: error.message
      });
    }
  }

}
