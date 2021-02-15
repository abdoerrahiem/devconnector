exports.up = function (knex) {
  return knex.schema.createTable('profiles', function (table) {
    table.increments()
    table.integer('userId').unsigned()
    table.string('company')
    table.string('website')
    table.string('location')
    table.string('status')
    table.string('skills')
    table.string('bio')
    table.string('githubusername')

    table.foreign('userId').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('profiles')
}
