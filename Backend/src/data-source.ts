import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Picture } from "./entities/Picture";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
    type: isProduction ? "postgres" : "sqlite",
    host: isProduction ? process.env.DB_HOST : undefined,
    port: isProduction ? parseInt(process.env.DB_PORT || "5432", 10) : undefined,
    username: isProduction ? process.env.DB_USER : undefined,
    password: isProduction ? process.env.DB_PASSWORD : undefined,
    database: isProduction ? process.env.DB_NAME : "database.sqlite",
    synchronize: true,
    logging: true,
    entities: isProduction ? ["dist/entities/*.js"] : ["src/entities/*.ts"],
    migrations: ["dist/migrations/*.js"],
});
