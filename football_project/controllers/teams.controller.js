import { pool } from "../config/db.js"

const getAllTeams = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teams")
    res.status(200).json({ message: "All teams retrieved", teams: result.rows })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM teams WHERE team_id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Team not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createTeam = async (req, res) => {
  try {
    const { team_name, club_id, group_id, coach_name } = req.body
    const result = await pool.query(
      `INSERT INTO teams (team_name, club_id, group_id, coach_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [team_name, club_id, group_id, coach_name]
    )
    res.status(201).json({ message: "Team created", team: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params
    const { team_name, club_id, group_id, coach_name } = req.body
    const fields = []
    const values = []

    if (team_name) { fields.push(`team_name = $${fields.length + 1}`); values.push(team_name); }
    if (club_id) { fields.push(`club_id = $${fields.length + 1}`); values.push(club_id); }
    if (group_id) { fields.push(`group_id = $${fields.length + 1}`); values.push(group_id); }
    if (coach_name) { fields.push(`coach_name = $${fields.length + 1}`); values.push(coach_name); }

    if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

    values.push(id)
    const query = `UPDATE teams SET ${fields.join(", ")} WHERE team_id = $${values.length} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) return res.status(404).json({ message: "Team not found" })
    res.status(200).json({ message: "Team updated", team: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM teams WHERE team_id = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Team not found" })
    res.status(200).json({ message: "Team deleted", team: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam }
