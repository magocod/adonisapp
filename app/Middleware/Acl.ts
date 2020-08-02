import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ForbiddenException from '../Exceptions/ForbiddenException';
// import UnAuthorizedException from '../Exceptions/UnAuthorizedException';

export default class Acl {
  public async handle (
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[],
  ) {
    // console.log(`"${request.url()}" enforces "${allowedRoles}" roles`)

    if (Array.isArray(allowedRoles) === false) {
      throw new ForbiddenException()
    }

    const user = await auth.authenticate();
    await user.preload('roles');
    const roles = user.roles.map((role) => {
        return role.slug;
    })
    // console.log(roles)

    // call next to advance the request
    for (const roleName of allowedRoles) {
        // console.log(roleName);
        if (roles.includes(roleName)) {
            await next()
            return;
        }
    }

    throw new ForbiddenException()

  }
}
