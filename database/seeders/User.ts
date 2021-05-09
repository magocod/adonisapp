import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.create({
      first_name: 'user',
      last_name: 'User',
      email: 'user@mail.com',
      status: true,
      is_active: true,
      password: '123',
    });
  }
}
