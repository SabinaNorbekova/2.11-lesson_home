import express from "express"
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
} from "../controllers/tournaments.controller.js"

const TournamentsRouter = express.Router()

TournamentsRouter.get("/", getAllTournaments)
TournamentsRouter.get("/:id", getTournamentById)
TournamentsRouter.post("/", createTournament)
TournamentsRouter.put("/:id", updateTournament)
TournamentsRouter.delete("/:id", deleteTournament)

export default TournamentsRouter
