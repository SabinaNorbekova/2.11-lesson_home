import express from "express"
import { getAllClubs, getClubById, createClub, updateClub, deleteClub } from "../controllers/clubs.controller.js"

const ClubRouter = express.Router()

ClubRouter.get("/", getAllClubs)
ClubRouter.get("/:id", getClubById)
ClubRouter.post("/", createClub)
ClubRouter.put("/:id", updateClub)
ClubRouter.delete("/:id", deleteClub)

export default ClubRouter
