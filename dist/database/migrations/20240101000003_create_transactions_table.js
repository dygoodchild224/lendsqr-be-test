"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("transactions", (table) => {
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
async function down(knex) {
    await knex.schema.dropTableIfExists("transactions");
}
//# sourceMappingURL=20240101000003_create_transactions_table.js.map