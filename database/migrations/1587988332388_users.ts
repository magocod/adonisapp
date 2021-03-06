import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      // new
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      // skip the many-to-many relationship and assign a single role to the user
      table.integer('role_id').nullable()

      table.boolean('status')
      table.boolean('is_active').notNullable().defaultTo(false)

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
