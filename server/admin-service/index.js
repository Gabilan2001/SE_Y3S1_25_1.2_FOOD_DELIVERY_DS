import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminPaymentRoutes from './routes/adminPaymentRoutes.js';

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const PORT =  3030 || process.env.PORT;


app.use("/api/restaurant", restaurantRoutes); 
app.use('/api/admin', userRoutes);
// Register the admin payment and payout routes
app.use('/api/admin', adminPaymentRoutes);



app.get("/", (req, res) => {
    ///server to client 
    res.send("Server is running");
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})

app.use('/api/auth', authRoutes);