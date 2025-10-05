import express from "express"
import morgan from "morgan"
import MainRouter from "./routes/main.routes.js" 

const app = express()
app.use(morgan("tiny"))
app.use(express.json())

const PORT = 3000;
app.use("/", MainRouter)

app.listen(PORT, () => {
  console.log(`The server is running successfully on port ${PORT}!`)
})
