exports.up = function (knex) {
  return knex.schema.createTable('comments', function (table) {
    table.increments()
    table.integer('postId').unsigned()
    table.integer('userId').unsigned()
    table.string('text')
    table.string('name')
    table.string('avatar')

    table.foreign('postId').references('id').inTable('posts')
    table.foreign('userId').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('comments')
}
