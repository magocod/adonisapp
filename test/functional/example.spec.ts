import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../common'

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    const response = await supertest(BASE_URL).get('/').expect(200)
    // console.log(response.body)
    assert.equal(JSON.stringify(response.body), JSON.stringify({ hello: 'world' }))
  })
})
