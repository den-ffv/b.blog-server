import express from "express";
import bodyParser from "body-parser"
import cors from "cors"
import 'dotenv/config'

import router from "./routes/routes.js";

const PORT = process.env.PORT || 5050
const app = express()

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use("/api", router)


app.listen(PORT, () => {
    console.log(`The server has been successfully launched on ${PORT} port🚀`)
})