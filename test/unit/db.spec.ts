import test from 'japa'

import User from 'App/Models/User'

test.group('User password', () => {
  test('ensure user password gets hashed during save', async (assert) => {
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
