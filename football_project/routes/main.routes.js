import express from "express"
import clubsRouter from "./clubs.routes.js"
import tournamentsRouter from "./tournaments.routes.js"
import groupsRouter from "./groups.routes.js"
import teamsRouter from "./teams.routes.js"
import playersRouter from "./players.routes.js"
import matchesRouter from "./matches.routes.js"

const MainRouter = express.Router()

MainRouter.use("/clubs", clubsRouter)
MainRouter.use("/tournaments", tournamentsRouter)
MainRouter.use("/groups", groupsRouter)
MainRouter.use("/teams", teamsRouter)
MainRouter.use("/players", playersRouter)
MainRouter.use("/matches", matchesRouter)

export default MainRouter
