import express from "express"
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from "../controllers/matches.controller.js"

const MatchesRouter = express.Router()

MatchesRouter.get("/", getAllMatches)
MatchesRouter.get("/:id", getMatchById)
MatchesRouter.post("/", createMatch)
MatchesRouter.put("/:id", updateMatch)
MatchesRouter.delete("/:id", deleteMatch)

export default MatchesRouter
