import { pool } from "../config/db.js"

const getAllMatches = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM match_fixtures")
    res.status(200).json({ message: "All matches retrieved", matches: result.rows })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getMatchById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM match_fixtures WHERE match_id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Match not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createMatch = async (req, res) => {
  try {
    const { match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status } = req.body
    const result = await pool.query(
      `INSERT INTO match_fixtures (match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status]
    )
    res.status(201).json({ message: "Match created", match: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateMatch = async (req, res) => {
  try {
    const { id } = req.params
    const { home_score, away_score, match_status } = req.body
    const fields = []
    const values = []

    if (home_score !== undefined) { fields.push(`home_score = $${fields.length + 1}`); values.push(home_score); }
    if (away_score !== undefined) { fields.push(`away_score = $${fields.length + 1}`); values.push(away_score); }
    if (match_status) { fields.push(`match_status = $${fields.length + 1}`); values.push(match_status); }

    if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

    values.push(id)
    const query = `UPDATE match_fixtures SET ${fields.join(", ")} WHERE match_id = $${values.length} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) return res.status(404).json({ message: "Match not found" })
    res.status(200).json({ message: "Match updated", match: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM match_fixtures WHERE match_id = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Match not found" })
    res.status(200).json({ message: "Match deleted", match: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllMatches, getMatchById, createMatch, updateMatch, deleteMatch }
