import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RolesController {
  public async index (ctx: HttpContextContract) {
    console.log(ctx)
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
