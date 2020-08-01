import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UserSeeder extends BaseSeeder {
  public async run () {

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

    const superUser = await User.create({
  		first_name: 'root',
	    last_name: 'root',
	    email: 'root@mail.com',
	    status: true,
	    is_active: true,
	    role_id: 1,
      password: '123',
  	});
  	await superUser.related('roles').attach([superUserRole.id])

  	const adminUser = await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@mail.com',
      status: true,
      is_active: true,
      role_id: adminRole.id,
      password: '123',
    });
    await adminUser.related('roles').attach([adminRole.id])

    const basicUser = await User.create({
      first_name: 'user',
      last_name: 'User',
      email: 'user@mail.com',
      status: true,
      is_active: true,
      role_id: userRole.id,
      password: '123',
    });
    await basicUser.related('roles').attach([userRole.id])

  }
}
