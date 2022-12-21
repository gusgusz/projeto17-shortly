import pkg from "pg";

const {Pool} = pkg;

export const connectionDb = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "gusgusgus",
    database: "shortlyAPI",
});
