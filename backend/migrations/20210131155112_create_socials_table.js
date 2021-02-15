exports.up = function (knex) {
  return knex.schema.createTable('socials', function (table) {
    table.increments()
    table.integer('userId').unsigned()
    table.integer('profileId').unsigned()
    table.string('youtube')
    table.string('twitter')
    table.string('facebook')
    table.string('linkedin')
    table.string('instagram')

    table.foreign('userId').references('id').inTable('users')
    table.foreign('profileId').references('id').inTable('profiles')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('socials')
}
