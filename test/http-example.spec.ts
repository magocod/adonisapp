import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'

import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', (group) => {

  // group.before(async () => {
  //   console.log('before all tests')
  // })

  // group.beforeEach(async () => {
  //   console.log('before every test')
  // })

  // group.after(async () => {
  //   console.log('after all tests')
  // })

  // group.afterEach(async () => {
  //   console.log('after every test')
  // })


  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure home page works', async () => {
    /**
     * Make request
     */
    // const { text } = await supertest(BASE_URL)
    await supertest(BASE_URL)
      .get('/')
      .expect(200)

    // console.log(text)

    /**
     * Construct JSDOM instance using the response HTML
     */
    // const { document } = new JSDOM(text).window

    // const title = document.querySelector('.title')
    // assert.exists(title)
    // assert.equal(title!.textContent!.trim(), 'It Works!')
  })

  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    user.first_name = 'test'
    user.last_name = 'test'
    await user.save()
 
    assert.notEqual(user.password, 'secret')
  })

})
