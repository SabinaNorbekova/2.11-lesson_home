import { pool } from "../config/db.js"

const getAllPlayers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players")
    res.status(200).json({ message: "All players retrieved", players: result.rows })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM players WHERE player_id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Player not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createPlayer = async (req, res) => {
  try {
    const { full_name, date_of_birth, position, team_id, jersey_number } = req.body
    const result = await pool.query(
      `INSERT INTO players (full_name, date_of_birth, position, team_id, jersey_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [full_name, date_of_birth, position, team_id, jersey_number]
    )
    res.status(201).json({ message: "Player created", player: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, position, jersey_number } = req.body
    const fields = []
    const values = []

    if (full_name) { fields.push(`full_name = $${fields.length + 1}`); values.push(full_name); }
    if (position) { fields.push(`position = $${fields.length + 1}`); values.push(position); }
    if (jersey_number) { fields.push(`jersey_number = $${fields.length + 1}`); values.push(jersey_number); }

    if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

    values.push(id)
    const query = `UPDATE players SET ${fields.join(", ")} WHERE player_id = $${values.length} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) return res.status(404).json({ message: "Player not found" })
    res.status(200).json({ message: "Player updated", player: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM players WHERE player_id = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Player not found" })
    res.status(200).json({ message: "Player deleted", player: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer }
