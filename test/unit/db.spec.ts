import { assert } from 'chai'

import User from 'App/Models/User'

describe('sample', function () {
  it('ensure user password gets hashed during save', async function () {
    const user = await User.create({
      first_name: 'admin',
      last_name: 'admin',
      email: 'admin@mail.com',
      status: true,
      is_active: true,
      password: 'secret',
    })
    assert.notEqual(user.password, 'secret')
  })
})
