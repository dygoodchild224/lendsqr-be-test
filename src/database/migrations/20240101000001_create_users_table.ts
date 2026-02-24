import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("phone").notNullable();
    table.string("token").unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}