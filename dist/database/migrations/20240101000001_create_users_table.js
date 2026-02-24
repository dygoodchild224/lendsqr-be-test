"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary();
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        table.string("phone").notNullable();
        table.string("token").unique().notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists("users");
}
//# sourceMappingURL=20240101000001_create_users_table.js.map