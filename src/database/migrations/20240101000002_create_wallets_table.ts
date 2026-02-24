import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table: Knex.TableBuilder) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable();
    table.decimal("balance", 15, 2).defaultTo(0.00).notNullable();
    table.timestamps(true, true);

    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
}