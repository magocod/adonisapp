import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {

  /**
   * Show a list of all users.
   * GET api/users
   *
   */
  public async index ({ response }: HttpContextContract) {
    const users = await User
    .query()
    .apply((scopes) => scopes.allRelationships());

    return response.status(200).json({
      message: 'Operacion exitosa',
      data: users
    });
  }

  public async create (ctx: HttpContextContract) {
    console.log(ctx)
  }

  public async store (ctx: HttpContextContract) {
    console.log(ctx)
  }

  /**
   * [show description]
   *
   * Display a single user.
   * GET users/:id
   */
  public async show ({ params, response }: HttpContextContract) {
    try {
      // console.log(params);
      const userInstance = await User.findOrFail(params.id);
      // console.log(await userInstance.getRolesSlug())

      const userResponse = await User
      .query()
      .where('id', userInstance.id)
      .apply((scopes) => scopes.allRelationships())
      .first();

      return response.status(200).json({
        message: 'Operacion exitosa',
        data: userResponse
      });

    } catch (error) {
      console.log(error)
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error buscando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  public async edit (ctx: HttpContextContract) {
    console.log(ctx)
  }

  public async update (ctx: HttpContextContract) {
    console.log(ctx)
  }

  /**
   * [destroy description]
   *
   * Delete a user with id.
   * DELETE users/:id
   *
   */
  public async destroy ({ params, response, auth }: HttpContextContract) {
    try {
      // console.log(params);
      const userInstance = await User.findOrFail(params.id);

      const user = await auth.authenticate();

      if (user.id == params.id) {
        // you cannot eliminate
        return response.status(403).json({
          message: 'No puedes eliminarte a ti mismo',
          details: "",
          err_message: ""
        });
      }

      const roles = await userInstance.getRolesSlug()

      if (roles.includes('root')) {
        // Cannot delete superusers with http queries
        return response.status(403).json({
          message: 'No tienes permiso para eliminar este usuario',
          details: "No se pueden eliminar usuarios root con consultas http",
          err_message: ""
        });
      }

      await userInstance.delete();

      return response.status(200).json({
        message: 'Usuario eliminado',
        data: null
      });

    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error eliminando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }

}
