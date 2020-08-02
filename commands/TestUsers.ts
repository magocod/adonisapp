import { BaseCommand } from '@adonisjs/ace'

import User from '../app/Models/User'
import Role from '../app/Models/Role'

export default class TestUsers extends BaseCommand {
  public static commandName = 'test:users'
  public static description = ''

  public async handle () {
    this.logger.info('Hello world!')

    const superUserRole = await Role.create({
      name: 'root',
      slug: 'root',
      description: 'Posee todos los permisos'
    });

    const adminRole = await Role.create({
      name: 'admin',
      slug: 'admin',
      description: 'Administrador del sistema'
    });

    const userRole = await Role.create({
      name: 'user',
      slug: 'user',
      description: 'usuario del sistema'
    });

    // users
    
    const users = [
      // root users
      {
        first_name: 'Root',
        last_name: 'root',
        email: 'root@mail.com',
        status: true,
        is_active: true,
        role_id: superUserRole.id,
        password: '123'
      },
      {
        first_name: 'Root_2',
        last_name: 'Root_2',
        email: 'root2@mail.com',
        status: true,
        is_active: true,
        role_id: superUserRole.id,
        password: '123'
      },
      // admins
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@mail.com',
        status: true,
        is_active: true,
        role_id: adminRole.id,
        password: '123'
      },
      {
        first_name: 'Admin_2',
        last_name: 'User_2',
        email: 'admin2@mail.com',
        status: true,
        is_active: true,
        role_id: adminRole.id,
        password: '123'
      },
      {
        first_name: 'Admin_3',
        last_name: 'User_3',
        email: 'admindisabled@mail.com',
        status: false,
        is_active: false,
        role_id: adminRole.id,
        password: '123'
      },
      // basic users
      {
        first_name: 'user',
        last_name: 'User',
        email: 'user@mail.com',
        status: true,
        is_active: true,
        role_id: userRole.id,
        password: '123'
      },
      {
        first_name: 'user_2',
        last_name: 'User_2',
        email: 'user2@mail.com',
        status: true,
        is_active: true,
        role_id: userRole.id,
        password: '123'
      },
      {
        first_name: 'user_3',
        last_name: 'User_3',
        email: 'userdisabled@mail.com',
        status: false,
        is_active: false,
        role_id: userRole.id,
        password: '123'
      }
    ];

    for (const userData of users) {
      const userInstance = await User.create({
        ...userData,
        // other data
      });
      await userInstance.related('roles').attach([userData.role_id])
    }

  }
}
