import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id');
      table.string('type');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
