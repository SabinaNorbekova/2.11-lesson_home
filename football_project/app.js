import express from "express"
import mainRouter from "./routes/mainRouter.js"

const app = express()
app.use(express.json())
app.use("/api", mainRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Football Project server running on port ${PORT}`)
})
