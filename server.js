const express = require("express")
const dotenv = require("dotenv").config()
const router = require("./routes/contactRoutes")
const { errorHandler } = require("./middleware/errorHandler")
const connectDB = require("./config/dbConnection")
const userRouter = require("./routes/userRoutes")

connectDB();
const app = express()

app.use(express.json())
app.use("/api/contacts", router)
app.use("/api/users", userRouter)

app.use(errorHandler)
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
}) 