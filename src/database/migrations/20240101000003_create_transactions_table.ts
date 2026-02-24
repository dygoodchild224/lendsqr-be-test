import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table: Knex.TableBuilder) => {
    table.uuid("id").primary();
    table.uuid("sender_wallet_id").nullable();
    table.uuid("receiver_wallet_id").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.enum("type", ["fund", "transfer", "withdraw"]).notNullable();
    table.timestamps(true, true);

    table.foreign("sender_wallet_id").references("id").inTable("wallets").onDelete("SET NULL");
    table.foreign("receiver_wallet_id").references("id").inTable("wallets").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}