import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../../common'
import { generate_user } from '../../fixtures/users'

import User from 'App/Models/User'
import { validator, ApiErrorNode } from '@ioc:Adonis/Core/Validator'

/**
 *
 * @param user_id
 */
async function _get_user_query(user_id: number) {
  const query = await User.query()
    .where('id', user_id)
    .apply((scopes) => {
      scopes.allRelationships()
    })
    .first()
  if (query === null) {
    throw new Error('user null')
  }
  return query
}

interface ValidationMessage {
  errors: ApiErrorNode[]
}

/**
 *
 * @param values
 * @param user_id
 */
async function _validate_form(values: unknown, user_id: number) {
  try {
    await validator.validate({
      schema: User.profileRules(user_id),
      reporter: validator.reporters.api,
      data: values,
    })
    return {
      errors: [],
    } as ValidationMessage
  } catch (error) {
    return error.messages as ValidationMessage
  }
}

test.group('Authenticated user', () => {
  test('get profile', async (assert) => {
    const { user, authHeaderVal } = await generate_user()
    const response = await supertest(BASE_URL)
      .get('/api/auth/profile')
      .set('Authorization', authHeaderVal)
      .expect(200)
    const query = await _get_user_query(user.id)
    // console.log(response.body)
    assert.deepEqual(response.body, { data: query.toJSON(), message: 'authenticated user' })
  })

  test('invalid token', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid')
      .expect(401)
    // console.log(response.body)
    assert.deepEqual(response.body, {
      message: 'Operation failed',
      details: 'general exception catch',
      err_message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
    })
  })

  test('update profile', async (assert) => {
    const { user, authHeaderVal } = await generate_user()
    const request = {
      email: 'new_email@domain.com',
      first_name: 'abc',
      last_name: 'def',
    }
    const response = await supertest(BASE_URL)
      .post('/api/auth/update_profile')
      .set('Authorization', authHeaderVal)
      .send(request)
      .expect(200)
    const afterQuery = await _get_user_query(user.id)

    // console.log(response.body)

    assert.equal(afterQuery.email, request.email)
    assert.equal(afterQuery.first_name, request.first_name)
    assert.equal(afterQuery.last_name, request.last_name)

    assert.deepEqual(response.body, { data: afterQuery.toJSON(), message: 'Updated user profile' })
  })

  test('validate form', async (assert) => {
    const { user, authHeaderVal } = await generate_user()
    const request = {
      emails: 'new_email@domain.com',
      first_name: false,
      last_name: [],
    }

    const validation = await _validate_form(request, user.id)
    // console.log(validation.errors)
    const response = await supertest(BASE_URL)
      .post('/api/auth/update_profile')
      .set('Authorization', authHeaderVal)
      .send(request)
      .expect(422)
    const afterQuery = await _get_user_query(user.id)

    // console.log(response.body)

    assert.equal(afterQuery.email, user.email)
    assert.equal(afterQuery.first_name, user.first_name)
    assert.equal(afterQuery.last_name, user.last_name)

    assert.deepEqual(response.body, { errors: validation.errors })
  })
})
