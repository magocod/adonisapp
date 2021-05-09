import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from 'App/Models/Role'

export default class RolesController {
  /**
   *
   * @param response
   */
  public async index({ response }: HttpContextContract) {
    const roles = await Role.all()
    return response.status(200).json({
      data: roles,
      message: 'successful operation',
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
