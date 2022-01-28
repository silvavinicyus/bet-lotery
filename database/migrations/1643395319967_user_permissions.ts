import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserPermissions extends BaseSchema {
  protected tableName = 'user_permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('user_id').notNullable();
      table.string('permission_id').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
