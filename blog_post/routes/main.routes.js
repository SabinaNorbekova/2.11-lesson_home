import { Router } from "express"
import CommentsRouter from "./comments.router.js"
import PostsRouter from "./posts.router.js"
import UsersRouter from "./users.router.js"

const MainRouter = Router()

MainRouter.use("/comments", CommentsRouter)
MainRouter.use("/posts", PostsRouter)
MainRouter.use("/users", UsersRouter)

export default MainRouter
