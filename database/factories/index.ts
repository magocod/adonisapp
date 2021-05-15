import Factory from '@ioc:Adonis/Lucid/Factory'

import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'

export const ApiTokenFactory = Factory.define(ApiToken, ({ faker }) => {
  return {
    name: 'Opaque Access Token',
    type: 'api',
    token: faker.datatype.uuid(),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    status: faker.datatype.boolean(),
    is_active: faker.datatype.boolean(),
  }
})
  .relation('api_tokens', () => ApiTokenFactory)
  .build()
