import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import marketRouter from "./routes/market";

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", marketRouter);

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        app.listen(3000, () => {
            console.log("Listening to port 3000!");
        });
    } catch (err) {
        console.log("Database Connection failed: ", err);
        process.exit(1);
    }
}

dbConnect();
