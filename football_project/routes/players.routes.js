import express from "express"
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} from "../controllers/players.controller.js"

const PlayersRouter = express.Router()

PlayersRouter.get("/", getAllPlayers)
PlayersRouter.get("/:id", getPlayerById)
PlayersRouter.post("/", createPlayer)
PlayersRouter.put("/:id", updatePlayer)
PlayersRouter.delete("/:id", deletePlayer)

export default PlayersRouter
