import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageroutes.js";
import userRoutes from "./routes/userroutes.js";
import connectToMongoDb from "./db/connectToMongoDb.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on port ${PORT}`);

});
