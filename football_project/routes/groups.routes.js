import express from "express"
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
} from "../controllers/groups.controller.js"

const GroupsRouter = express.Router()

GroupsRouter.get("/", getAllGroups)
GroupsRouter.get("/:id", getGroupById)
GroupsRouter.post("/", createGroup)
GroupsRouter.put("/:id", updateGroup)
GroupsRouter.delete("/:id", deleteGroup)

export default GroupsRouter
