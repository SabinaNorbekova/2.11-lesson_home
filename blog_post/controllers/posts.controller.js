import { pool } from "../config/blog_post_db.js"

const findAll = async (req, res) => {
  try {
    const query = `SELECT * FROM posts ORDER BY post_id ASC`
    const allPosts = await pool.query(query)

    return res.status(200).json({
      message: "Successfully retrieved all posts!",
      posts: allPosts.rows
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "SERVER ERROR", error: error.message })
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const query = `SELECT * FROM posts WHERE post_id = $1`
    const result = await pool.query(query, [id])

    if (result.rows.length === 0)
      return res.status(404).json({ message: `No post found with id = ${id}` })

    return res.status(200).json({
      message: `Found post with id = ${id}`,
      post: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "SERVER ERROR", error: error.message })
  }
}

const createOne = async (req, res) => {
  try {
    const { title, content, slug, user_id } = req.body

    if (!title || !slug || !user_id) {
      return res.status(400).json({
        message: "Please provide title, slug, and user_id!"
      })
    }

    const userCheck = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: `User not found (id=${user_id})` })
    }

    const query = `
      INSERT INTO posts (title, content, slug, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const newPost = await pool.query(query, [title, content, slug, user_id])

    return res.status(201).json({
      message: "Successfully created a new post!",
      post: newPost.rows[0]
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR", error: error.message })
  }
}

const updateOne = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, slug } = req.body

    const existing = await pool.query(`SELECT * FROM posts WHERE post_id = $1`, [id])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: `Post not found (id=${id})` })
    }

    const fields = []
    const values = []

    if (title) {
      fields.push(`title = $${fields.length + 1}`)
      values.push(title)
    }
    if (content) {
      fields.push(`content = $${fields.length + 1}`)
      values.push(content)
    }
    if (slug) {
      fields.push(`slug = $${fields.length + 1}`)
      values.push(slug)
    }

    if (fields.length === 0)
      return res.status(400).json({ message: "Nothing to update!" })

    values.push(id)
    const query = `UPDATE posts SET ${fields.join(", ")} WHERE post_id = $${values.length} RETURNING *`
    const updated = await pool.query(query, values)

    return res.status(200).json({
      message: "Successfully updated the post!",
      post: updated.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "SERVER ERROR", error: error.message })
  }
}

const deleteOne = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await pool.query(
      `DELETE FROM posts WHERE post_id = $1 RETURNING *`,
      [id]
    )

    if (deleted.rows.length === 0)
      return res.status(404).json({ message: `Post not found (id=${id})` })

    return res.status(200).json({
      message: "Successfully deleted the post!",
      post: deleted.rows[0]
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
      query = `SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1 OFFSET $2 LIMIT $3;`
      values = [`%${filter}%`, offset, limit]
    } else {
      query = `SELECT * FROM posts OFFSET $1 LIMIT $2;`
      values = [offset, limit]
    }

    const result = await pool.query(query, values)
    return res.status(200).json({
      message: "Filtered or all posts retrieved!",
      total: result.rows.length,
      posts: result.rows
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR", error: error.message })
  }
}

export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
