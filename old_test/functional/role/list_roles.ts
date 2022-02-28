import test from 'japa'
import supertest from 'supertest'

import { BASE_URL, UserRoleIds } from '../../common'
import Role from 'App/Models/Role'
import { generate_user } from '../../fixtures/users'

test.group('List roles', () => {
  test('load all roles', async (assert) => {
    const { authHeaderVal } = await generate_user([UserRoleIds.ADMIN])
    const response = await supertest(BASE_URL)
      .get('/api/roles')
      .set('Authorization', authHeaderVal)
      .expect(200)
    const roles = await Role.all()
    const rolesJson = roles.map((r) => r.serialize())
    // console.log(response.body)
    assert.equal(response.body.message, 'successful operation')
    assert.deepEqual(response.body.data, rolesJson)
  })

  test('does not have an administrative role (error)', async (assert) => {
    const { authHeaderVal } = await generate_user()
    const response = await supertest(BASE_URL)
      .get('/api/roles')
      .set('Authorization', authHeaderVal)
      .expect(403)
    // console.log(response.body)
    assert.deepEqual(response.body, {
      message: 'Access forbidden. You are not allowed to this resource.',
      details: 'current user does not have required role',
      err_message: 'FORBIDDEN: Not allowed',
    })
  })
})
