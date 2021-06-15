/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/socket', async ({ view }) => {
  return view.render('welcome')
})

Route.resource('/io', 'IosController')

Route.group(() => {
  // public
  Route.post('login', 'AuthController.login')

  Route.get('profile', 'AuthController.currentUser').middleware(['auth'])
  Route.post('update_profile', 'AuthController.updateProfile').middleware(['auth'])
  Route.post('logout', 'AuthController.logout').middleware(['auth'])
}).prefix('/api/auth')

Route.resource('/api/roles', 'RolesController')
  .apiOnly()
  .middleware({
    '*': ['auth', 'acl:root,admin'],
  })

Route.resource('/api/users', 'UsersController')
  .apiOnly()
  .middleware({
    '*': ['auth', 'acl:root,admin'],
  })

Route.get('/file/:name', 'FilesController.download')
