import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Tokens extends BaseSchema {
  protected tableName = 'tokens';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('user_id').unsigned().references('id').inTable('users');
      table.string('token', 255).notNullable().unique();
      table.string('type').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
