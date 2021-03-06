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
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// auth module

Route.group(() => {
  // public
  Route.post('login', 'auth/AuthController.login');

  Route.get('profile', 'auth/AuthController.currentUser').middleware(['auth']);
  Route.post('profile', 'auth/AuthController.updateProfile').middleware(['auth']);
  Route.get('logout', 'auth/AuthController.logout').middleware(['auth']);

}).prefix('api/auth');

// users
Route.get('api/users', 'auth/UserController.index').middleware(['auth', 'acl:root,admin'])
Route.get('api/users/:id', 'auth/UserController.show').middleware(['auth', 'acl:root,admin'])
Route.post('api/users', 'auth/UserController.store').middleware(['auth', 'acl:root,admin'])
Route.put('api/users/:id', 'auth/UserController.show').middleware(['auth', 'acl:root,admin'])
Route.delete('api/users/:id', 'auth/UserController.show').middleware(['auth', 'acl:root,admin'])

// roles
Route.get('api/roles', 'auth/RolesController.index').middleware(['auth', 'acl:root,admin'])

// excel
Route.group(() => {
	Route.get('test', 'ExcelsController.test')
	Route.post('v1', 'ExcelsController.readV1')
}).prefix('api/excel');
