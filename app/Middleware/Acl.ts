import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Acl {
  public async handle (
    { request }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[],
  ) {
    console.log(`"${request.url()}" enforces "${allowedRoles}" roles`)
    await next()
  }
}
