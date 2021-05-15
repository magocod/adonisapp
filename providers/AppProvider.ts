import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.bind('ChanceFaker', () => {
      return 10
    })
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
