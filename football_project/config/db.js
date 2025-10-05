import pg from "pg"
const { Pool } = pg

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    port: 5432,
    database: "football_project"
})

export { pool }
