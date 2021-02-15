exports.up = function (knex) {
  return knex.schema.createTable('posts', function (table) {
    table.increments()
    table.integer('userId').unsigned()
    table.string('text')
    table.string('name')
    table.string('avatar')

    table.foreign('userId').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('posts')
}
