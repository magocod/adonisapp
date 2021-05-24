import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class CreateUser extends BaseCommand {
  public static commandName = 'create:user'
  public static description = 'Create a new user'

  public async run() {
    const email = await this.prompt.ask('Enter email')
    const password = await this.prompt.secure('Choose account password')
    const userType = await this.prompt.choice('Select account type', [
      {
        name: 'admin',
        message: 'Admin (Complete access)',
      },
      {
        name: 'collaborator',
        message: 'Collaborator (Can access specific resources)',
      },
      {
        name: 'user',
        message: 'User (Readonly access)',
      },
    ])

    const verifyEmail = await this.prompt.confirm('Send account verification email?')
    const accountTags = await this.prompt.enum('Type tags to associate with the account')

    console.log({
      email,
      password,
      userType,
      verifyEmail,
      accountTags,
    })
  }
}
