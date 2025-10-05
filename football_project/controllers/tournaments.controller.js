import { pool } from "../config/db.js"

const getAllTournaments = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tournaments");
        res.status(200).json({ message: "All tournaments", tournaments: result.rows })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getTournamentById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("SELECT * FROM tournaments WHERE tournament_id = $1", [id])
        if (result.rows.length === 0) return res.status(404).json({ message: "Tournament not found" })
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const createTournament = async (req, res) => {
    try {
        const { tournament_name, start_date, end_date, status } = req.body
        const result = await pool.query(
            `INSERT INTO tournaments (tournament_name, start_date, end_date, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [tournament_name, start_date, end_date, status]
        )
        res.status(201).json({ message: "Tournament created", tournament: result.rows[0] })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const updateTournament = async (req, res) => {
    try {
        const { id } = req.params
        const { tournament_name, start_date, end_date, status } = req.body
        const fields = []
        const values = []

        if (tournament_name) { fields.push(`tournament_name = $${fields.length + 1}`); values.push(tournament_name); }
        if (start_date) { fields.push(`start_date = $${fields.length + 1}`); values.push(start_date); }
        if (end_date) { fields.push(`end_date = $${fields.length + 1}`); values.push(end_date); }
        if (status) { fields.push(`status = $${fields.length + 1}`); values.push(status); }

        if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

        values.push(id)
        const query = `UPDATE tournaments SET ${fields.join(", ")} WHERE tournament_id = $${values.length} RETURNING *`
        const result = await pool.query(query, values)

        if (result.rows.length === 0) return res.status(404).json({ message: "Tournament not found" })
        res.status(200).json({ message: "Tournament updated", tournament: result.rows[0] })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query("DELETE FROM tournaments WHERE tournament_id = $1 RETURNING *", [id])
        if (result.rows.length === 0) return res.status(404).json({ message: "Tournament not found" })
        res.status(200).json({ message: "Tournament deleted", tournament: result.rows[0] })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export { getAllTournaments, getTournamentById, createTournament, updateTournament, deleteTournament }
