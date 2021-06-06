import test from 'japa'
import supertest from 'supertest'

import { BASE_URL, UserRoleIds } from '../../common'
import User from 'App/Models/User'
import { generate_user } from '../../fixtures/users'
import { UserFactory } from 'Database/factories'

test.group('List users', (group) => {
  group.before(async () => {
    // before all tests
    await UserFactory.createMany(5)
  })

  test('load all users', async (assert) => {
    const { authHeaderVal } = await generate_user([UserRoleIds.ADMIN])
    const queryParams = {
      page: 1,
      per_page: 2,
    }
    const response = await supertest(BASE_URL)
      .get(`/api/users?=page=${queryParams.page}&per_page=${queryParams.per_page}`)
      .set('Authorization', authHeaderVal)
      .expect(200)
    const users = await User.query().paginate(queryParams.page, queryParams.per_page)
    // console.log(response.body)
    assert.equal(response.body.message, 'successful operation')
    assert.equal(JSON.stringify(response.body.data), JSON.stringify(users.toJSON()))
  })

  test('does not have an administrative role (error)', async (assert) => {
    const { authHeaderVal } = await generate_user()
    const response = await supertest(BASE_URL)
      .get('/api/users')
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
