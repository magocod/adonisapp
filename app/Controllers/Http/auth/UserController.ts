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

  /**
   * [store description]
   *
   * Create/save a new user.
   * POST users
   *
   */
  public async store ({ request, response }: HttpContextContract) {

    // don't catch exception
    await request.validate({
      schema: User.createRules(),
    })

    try {

      const userData = request.only([
        'email',
        'password',
        'first_name',
        'last_name',
      ]);
      // console.log(userData);
      const roleId = 3; // basic user

      const userInstance = await User.create({
        ...userData,
        role_id: roleId,
        status: true,
        is_active: true
      });
      await userInstance.related('roles').attach([roleId])

      const userResponse = await User
      .query()
      .where(
        'id', userInstance.id
      )
      .apply((scopes) => scopes.allRelationships())
      .first();

      return response.status(201).json({
        message: 'Usuario registrado',
        data: userResponse
      });

    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: "Error registrando usuario",
        details: "",
        err_message: error.message
      });
    }
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
        message: "Error buscando usuario",
        details: "",
        err_message: error.message
      });
    }
  }

  /**
   * [update description]
   *
   * Update user details.
   * PUT or PATCH users/:id
   *
   */
  public async update ({ params, request, response, auth }: HttpContextContract) {

    // don't catch exception

    const userInstance = await User.findOrFail(params.id);
    await request.validate({
      schema: User.updateRules(userInstance.id),
    })

    try {

      const roles = await userInstance.getRolesSlug();

      if (roles.includes('root')) {
        // You do not have permission to edit this user
        return response.status(403).json({
          message: 'No tienes permiso para editar este usuario',
          details: "Solo un usuario root se puede modificar a si mismo",
          err_message: ""
        });
      }

      const authUser = await auth.authenticate();

      const authRoles = await authUser.getRolesSlug()
      if (roles.includes('admin') && authRoles.includes('root') === false) {
        return response.status(
          403
        ).json({
          message: 'No tienes permiso para editar este usuario',
          details: "Un usuario administrador, no puede modificar otro administrador",
          err_message: ""
        }); 
      }

      const userData = request.only([
        'email',
        'first_name',
        'last_name',
      ]);
      // console.log(userData);

      userInstance.email = userData.email;
      userInstance.first_name = userData.first_name;
      userInstance.last_name = userData.last_name;
      
      await userInstance.save();

      const userResponse = await User.query().where(
        'id', userInstance.id
      )
      .apply((scopes) => scopes.allRelationships())
      .first();

      return response.status(200).json({
        message: 'Usuario modificado',
        data: userResponse
      });

    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        message: "Error modificando usuario",
        details: "",
        err_message: error.message
      });
    }
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
        message: "Error eliminando usuario",
        details: "",
        err_message: error.message
      });
    }
  }

}
