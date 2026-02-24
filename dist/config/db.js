"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = (0, knex_1.default)({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "lendsqr_wallet",
    },
    migrations: {
        directory: "./src/database/migrations",
        extension: "ts",
    },
    seeds: {
        directory: "./src/database/seeds",
        extension: "ts",
    },
});
exports.default = db;
//# sourceMappingURL=db.js.map