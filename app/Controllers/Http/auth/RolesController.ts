import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from 'App/Models/Role'

export default class RolesController {

  /**
   * [index description]
   * Get all roles
   */
  public async index (ctx: HttpContextContract) {
    const roles = await Role.all()
    return ctx.response.status(200).json({
      data: roles,
      message: 'operacion exitosa'
    })
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
