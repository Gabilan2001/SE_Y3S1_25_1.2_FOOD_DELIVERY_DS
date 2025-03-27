//  Importing required packages and modules
import express from "express";             // Express framework - helps to create a web server and APIs
import cors from "cors";                   // Enables Cross-Origin Resource Sharing (frontend <-> backend)
import dotenv from "dotenv";               // Loads environment variables from a .env file into process.env
import cookieParser from "cookie-parser";  // Parses cookies sent with HTTP requests
import mongoose from "mongoose";           // MongoDB Object Data Modeling (ODM) library
import helmet from "helmet";               // Adds security-related HTTP headers
import morgan from "morgan";               // Logs HTTP requests in the console (for debugging)
import connectDB from "./config/connectDB.js"; // Custom function to connect to MongoDB
import userRouter from "./routes/user.route.js";


//  Load environment variables (like PORT, MONGODB_URI, FRONTEND_URL) from .env file
dotenv.config();

//  Create an Express application instance
const app = express(); 
// Now `app` is your web server object. You use it to define routes, middlewares, and start the server.

//  Enable CORS so frontend (like React) can communicate with the backend
app.use(cors({
    credentials: true, // Allows cookies and headers (like JWT) to be sent from frontend to backend
    origin: process.env.FRONTEND_URL // Only allow requests from this frontend URL (from .env file)
}));


//  Middleware to parse incoming JSON data in request bodies (for POST, PUT)
app.use(express.json());


// Middleware to read cookies sent from the frontend (stored in req.cookies)
app.use(cookieParser());


//  Middleware to log all incoming HTTP requests in the terminal in a short format
app.use(morgan('tiny'));


//  Middleware to set secure HTTP headers (protection from some attacks like XSS, clickjacking)
app.use(helmet({
    crossOriginResourcePolicy: false // Allow loading resources (like images) from other origins (e.g., frontend)
}));


//  Define the port the server should run on
// If PORT is set in .env file, use it. Otherwise, default to 8080.
const PORT = process.env.PORT || 8080;


//  A test route to check if the server is running
app.get("/", (req, res) => {
    res.json({
        message: `server is running on the port ${PORT}`
    });
});
// You can visit http://localhost:PORT in your browser to see this message

//in hear i setup api for routs
app.use("/api/user",userRouter)

//  Connect to MongoDB using Mongoose
connectDB();
// This is an async function that connects your backend to the MongoDB database
// If it fails, it logs an error and stops the server from running

//  Start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`server is running on the port ${PORT}`);
});
// When the server starts successfully, you'll see this message in the terminal
