import { pool } from "../config/blog_post_db.js"

const findAll = async (req, res) => {
    try {
        const query = `SELECT * FROM users ORDER BY user_id ASC`
        const result = await pool.query(query)
        return res.status(200).json({
            message: "All users retrieved successfully!",
            users: result.rows
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
}

const findOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id])
        if (result.rows.length === 0)
            return res.status(404).json({ message: `No user found with id=${id}` })

        return res.status(200).json({
            message: "Found user successfully!",
            user: result.rows[0]
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
};

const createOne = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone_number, address } = req.body

        if (!first_name || !last_name || !email || !password)
            return res.status(400).json({ message: "Please provide all required fields!" })

        const query = `
      INSERT INTO users (first_name, last_name, email, password, phone_number, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `
        const values = [first_name, last_name, email, password, phone_number, address]
        const newUser = await pool.query(query, values)

        return res.status(201).json({
            message: "Successfully created a new user!",
            user: newUser.rows[0]
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
};

const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const { first_name, last_name, email, password, phone_number, address } = req.body

        const existing = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id])
        if (existing.rows.length === 0)
            return res.status(404).json({ message: `User not found (id=${id})` })

        const fields = []
        const values = []

        if (first_name) { fields.push(`first_name = $${fields.length + 1}`); values.push(first_name); }
        if (last_name) { fields.push(`last_name = $${fields.length + 1}`); values.push(last_name); }
        if (email) { fields.push(`email = $${fields.length + 1}`); values.push(email); }
        if (password) { fields.push(`password = $${fields.length + 1}`); values.push(password); }
        if (phone_number) { fields.push(`phone_number = $${fields.length + 1}`); values.push(phone_number); }
        if (address) { fields.push(`address = $${fields.length + 1}`); values.push(address); }

        if (fields.length === 0)
            return res.status(400).json({ message: "Nothing to update!" })

        values.push(id)
        const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = $${values.length} RETURNING *`
        const updated = await pool.query(query, values)

        return res.status(200).json({
            message: "Successfully updated user!",
            user: updated.rows[0]
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
}

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await pool.query(`DELETE FROM users WHERE user_id = $1 RETURNING *`, [id])
        if (deleted.rows.length === 0)
            return res.status(404).json({ message: `User not found (id=${id})` })

        return res.status(200).json({
            message: "Successfully deleted user!",
            user: deleted.rows[0]
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
}

const filterAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = "" } = req.query
        const offset = (page - 1) * limit
        let query, values

        if (filter) {
            query = `
        SELECT * FROM users
        WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
        OFFSET $2 LIMIT $3;
      `
            values = [`%${filter}%`, offset, limit]
        } else {
            query = `SELECT * FROM users OFFSET $1 LIMIT $2;`
            values = [offset, limit]
        }

        const result = await pool.query(query, values)
        return res.status(200).json({
            message: "Filtered or all users retrieved!",
            total: result.rows.length,
            users: result.rows
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }
}

export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
