import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const [root, admin, basic] = await Role.createMany([
      {
        name: 'root',
        slug: 'root',
        description: 'Posee todos los permisos',
      },
      {
        name: 'admin',
        slug: 'admin',
        description: 'Administrador del sistema',
      },
      {
        name: 'user',
        slug: 'user',
        description: 'usuario del sistema',
      },
    ])

    const [rootUser, adminUser, basicUser] = await User.createMany([
      {
        first_name: 'root',
        last_name: 'root',
        email: 'root@mail.com',
        status: true,
        is_active: true,
        password: '123',
      },
      {
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@mail.com',
        status: true,
        is_active: true,
        password: '123',
      },
      {
        first_name: 'user',
        last_name: 'user',
        email: 'user@mail.com',
        status: true,
        is_active: true,
        password: '123',
      },
    ])

    await rootUser.related('roles').attach([root.id])
    await adminUser.related('roles').attach([admin.id])
    await basicUser.related('roles').attach([basic.id])
  }
}
