import express from "express"
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from "../controllers/teams.controller.js"

const TeamsRouter = express.Router()

TeamsRouter.get("/", getAllTeams)
TeamsRouter.get("/:id", getTeamById)
TeamsRouter.post("/", createTeam)
TeamsRouter.put("/:id", updateTeam)
TeamsRouter.delete("/:id", deleteTeam)

export default TeamsRouter
