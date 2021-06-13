import test from 'japa'
import supertest from 'supertest'

import { BASE_URL, UserRoleIds } from '../../common'
import { generate_user } from '../../fixtures/users'
import { UserFactory } from 'Database/factories'
import { count_model } from 'App/utils'
import User from 'App/Models/User'

test.group('user delete', () => {
  test('delete user', async (assert) => {
    const userToDelete = await UserFactory.create()
    const { authHeaderVal } = await generate_user([UserRoleIds.ADMIN])

    const count = await count_model(User)
    const response = await supertest(BASE_URL)
      .delete(`/api/users/${userToDelete.id}`)
      .set('Authorization', authHeaderVal)
      .expect(200)
    assert.deepEqual(response.body, {
      message: 'User Deleted',
      data: null,
    })

    assert.equal((await count_model(User)).total, count.total - 1)
  })

  test('cannot remove root type user', async (assert) => {
    const userToDelete = await UserFactory.create()
    await userToDelete.related('roles').attach([UserRoleIds.ROOT])

    const { authHeaderVal } = await generate_user([UserRoleIds.ADMIN])

    const count = await count_model(User)
    const response = await supertest(BASE_URL)
      .delete(`/api/users/${userToDelete.id}`)
      .set('Authorization', authHeaderVal)
      .expect(403)

    assert.deepEqual(response.body, {
      message: 'You do not have permission to delete this user',
      details: 'Cannot remove root users with http queries',
      err_message: '',
    })
    assert.equal((await count_model(User)).total, count.total)
  })
})
