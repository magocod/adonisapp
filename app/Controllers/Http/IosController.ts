import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Ws from 'App/Services/Ws'

export default class IosController {
  /**
   *
   */
  public async index({}: HttpContextContract) {
    const sockets = Ws.io.allSockets()
    console.log(sockets)
  }

  /**
   *
   */
  public async store({}: HttpContextContract) {
    Ws.io.emit('new:user', { username: 'virk' })
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
