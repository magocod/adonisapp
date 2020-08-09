import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {

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

  public async show (ctx: HttpContextContract) {
    console.log(ctx)
  }

  public async edit (ctx: HttpContextContract) {
    console.log(ctx)
  }

  public async update (ctx: HttpContextContract) {
    console.log(ctx)
  }

  public async destroy (ctx: HttpContextContract) {
    console.log(ctx)
  }

}
