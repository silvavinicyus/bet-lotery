import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Carts extends BaseSchema {
  protected tableName = 'carts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id');
      table.float('value').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
