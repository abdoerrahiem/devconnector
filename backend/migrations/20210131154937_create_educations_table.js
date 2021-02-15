exports.up = function (knex) {
  return knex.schema.createTable('educations', function (table) {
    table.increments()
    table.integer('userId').unsigned()
    table.integer('profileId').unsigned()
    table.string('school')
    table.string('degree')
    table.string('fieldofstudy')
    table.date('from')
    table.date('to')
    table.boolean('current').defaultTo(false)
    table.string('description')

    table.foreign('userId').references('id').inTable('users')
    table.foreign('profileId').references('id').inTable('profiles')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('educations')
}
