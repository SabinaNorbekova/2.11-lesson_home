import { pool } from "../config/db.js"

const getAllGroups = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tournament_groups")
    res.status(200).json({ message: "All groups retrieved", groups: result.rows })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM tournament_groups WHERE group_id = $1", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Group not found" })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createGroup = async (req, res) => {
  try {
    const { group_name, tournament_id, created_at } = req.body
    const result = await pool.query(
      `INSERT INTO tournament_groups (group_name, tournament_id, created_at)
       VALUES ($1, $2, $3) RETURNING *`,
      [group_name, tournament_id, created_at]
    )
    res.status(201).json({ message: "Group created", group: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { group_name, tournament_id } = req.body
    const fields = []
    const values = []

    if (group_name) { fields.push(`group_name = $${fields.length + 1}`); values.push(group_name); }
    if (tournament_id) { fields.push(`tournament_id = $${fields.length + 1}`); values.push(tournament_id); }

    if (fields.length === 0) return res.status(400).json({ message: "Nothing to update" })

    values.push(id)
    const query = `UPDATE tournament_groups SET ${fields.join(", ")} WHERE group_id = $${values.length} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) return res.status(404).json({ message: "Group not found" })
    res.status(200).json({ message: "Group updated", group: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM tournament_groups WHERE group_id = $1 RETURNING *", [id])
    if (result.rows.length === 0) return res.status(404).json({ message: "Group not found" })
    res.status(200).json({ message: "Group deleted", group: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export { getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup }
