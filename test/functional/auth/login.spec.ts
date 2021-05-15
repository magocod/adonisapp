import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../../common'
import { generate_user } from '../../fixtures/users'
import { validate_form } from '../../fixtures/validation'

import User from 'App/Models/User'

test.group('Auth user login', () => {
  test('Login Successful', async (assert) => {
    const { user } = await generate_user()
    const request = {
      email: user.email,
      password: '123',
    }
    const response = await supertest(BASE_URL).post('/api/auth/login').send(request).expect(200)
    const query = await User.query()
      .where('id', user.id)
      .apply((scopes) => {
        scopes.allRelationships()
      })
      .first()
    if (query === null) {
      throw new Error('user null')
    }
    // console.log(response.body)
    assert.deepEqual(response.body.data.user, query.toJSON())
    assert.containsAllKeys(response.body.data, ['access_token'])
  })

  test('failed, wrong credentials', async (assert) => {
    const { user } = await generate_user()
    const request = {
      email: user.email,
      password: 'wrong',
    }
    const response = await supertest(BASE_URL).post('/api/auth/login').send(request).expect(400)
    // console.log(response.body)
    assert.deepEqual(response.body, {
      message: 'Email or password error',
      details: '',
      err_message: 'E_INVALID_AUTH_PASSWORD: Password mis-match',
    })
  })

  test('form validation', async (assert) => {
    const request = {
      emails: false,
      password: [],
    }
    const validation = await validate_form(User.login_rules, request)
    const response = await supertest(BASE_URL).post('/api/auth/login').send(request).expect(422)
    // console.log(response.body)
    assert.deepEqual(response.body, {
      errors: validation.errors,
    })
  })

  test('Logout Successful', async (assert) => {
    const { authHeaderVal } = await generate_user()
    const response = await supertest(BASE_URL)
      .post('/api/auth/logout')
      // .set('Authorization', `Bearer ${token.token}`)
      .set('Authorization', authHeaderVal)
      .expect(200)
    // console.log(response.body)
    assert.deepEqual(response.body, { data: null, message: 'Successfully Logged Out' })
  })

  test('log out, invalid token', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer invalid')
      .expect(401)
    // console.log(response.body)
    assert.deepEqual(response.body, {
      message: 'Operation failed',
      details: 'general exception catch',
      err_message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
    })
  })
})
