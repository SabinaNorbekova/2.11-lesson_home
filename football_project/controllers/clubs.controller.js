import { pool } from "../config/db.js"

const getAllClubs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM football_clubs")
    res.status(200).json({ message: "All clubs retrieved", clubs: result.rows })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getClubById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM football_clubs WHERE club_id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Club not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createClub = async (req, res) => {
  try {
    const { club_name, city, country, founded_year } = req.body
    const result = await pool.query(
      `INSERT INTO football_clubs (club_name, city, country, founded_year)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [club_name, city, country, founded_year]
    )
    res.status(201).json({ message: "Club created", club: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateClub = async (req, res) => {
  try {
    const { id } = req.params
    const { club_name, city, country, founded_year } = req.body
    const fields = []
    const values = []

    if (club_name) { fields.push(`club_name = $${fields.length + 1}`); values.push(club_name); }
    if (city) { fields.push(`city = $${fields.length + 1}`); values.push(city); }
    if (country) { fields.push(`country = $${fields.length + 1}`); values.push(country); }
    if (founded_year) { fields.push(`founded_year = $${fields.length + 1}`); values.push(founded_year); }

    if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

    values.push(id)
    const query = `UPDATE football_clubs SET ${fields.join(", ")} WHERE club_id = $${values.length} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) return res.status(404).json({ message: "Club not found" })
    res.status(200).json({ message: "Club updated", club: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteClub = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM football_clubs WHERE club_id = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Club not found" })
    res.status(200).json({ message: "Club deleted", club: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllClubs, getClubById, createClub, updateClub, deleteClub }
