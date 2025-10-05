import { pool } from "../config/blog_post_db.js"

const findAll = async (req, res) => {
    try {
        const query = `SELECT * FROM comments ORDER BY comment_id ASC`
        const allComments = await pool.query(query)
        return res.status(200).json({
            message: "Successfully retrieved all comments!",
            comments: allComments.rows
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message,
        })
    }
}

const findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM comments WHERE comment_id = $1`
        const result = await pool.query(query, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No comment found with id = ${id}` })
        }

        return res.status(200).json({
            message: `ound comment with id = ${id}`,
            comment: result.rows[0],
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message
        })
    }
}

const createOne = async (req, res) => {
    try {
        const { content, post_id, user_id } = req.body

        if (!content || !post_id || !user_id) {
            return res.status(400).json({ message: "Please provide content, post_id, and user_id!" })
        }

        const userCheck = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: `User not found (id=${user_id})` })
        }

        const postCheck = await pool.query(`SELECT * FROM posts WHERE post_id = $1`, [post_id])
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: `Post not found (id=${post_id})` })
        }

        const query = `
      INSERT INTO comments (content, post_id, user_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `
        const newComment = await pool.query(query, [content, post_id, user_id])

        return res.status(201).json({
            message: "Successfully created a new comment!",
            comment: newComment.rows[0],
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message
        })
    }
};

const updateOne = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Please provide content to update!" })
        }

        const existing = await pool.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: `Comment not found (id=${id})` })
        }

        const query = `
      UPDATE comments
      SET content = $1
      WHERE comment_id = $2
      RETURNING *;
    `
        const updated = await pool.query(query, [content, id])

        return res.status(200).json({
            message: "Successfully updated the comment!",
            updatedComment: updated.rows[0]
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message
        })
    }
}

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params

        const deleted = await pool.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])

        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: `Comment not found (id=${id})` })
        }

        return res.status(200).json({
            message: "Successfully deleted the comment!",
            deletedComment: deleted.rows[0]
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message
        })
    }
}

const filterAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = "" } = req.query
        const offset = (page - 1) * limit

        let query, values
        if (filter) {
            query = `
        SELECT * FROM comments
        WHERE content ILIKE $1
        OFFSET $2 LIMIT $3;
      `
            values = [`%${filter}%`, offset, limit]
        } else {
            query = `SELECT * FROM comments OFFSET $1 LIMIT $2;`
            values = [offset, limit]
        }

        const result = await pool.query(query, values);
        return res.status(200).json({
            message: filter
                ? `Filtered results for "${filter}"`
                : "All comments (no filter)",
            total: result.rows.length,
            page,
            limit,
            comments: result.rows
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "SERVER ERROR",
            error: error.message
        })
    }
}

export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
