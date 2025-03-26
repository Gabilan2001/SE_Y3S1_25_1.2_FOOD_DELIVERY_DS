//  Import mongoose (MongoDB library) and dotenv (for environment variables)
import mongoose from "mongoose";
import dotenv from "dotenv";

//  Load environment variables from the .env file into process.env
dotenv.config();

// Check if MONGODB_URI is provided in .env
if (!process.env.MONGODB_URI) {
    // If not, throw an error and stop the app
    throw new Error("Please provide MongoDB URI inside the .env file");
}


//  Define an async function to connect to MongoDB
async function connectDB() {
    try {
        // Try connecting to MongoDB using the URI from .env
        await mongoose.connect(process.env.MONGODB_URI);
        
        //  If successful, log success message
        console.log(" Connected to MongoDB successfully");
    } catch (error) {
        //  If connection fails, log error message
        console.error(" MongoDB connection error:", error.message);

        //  Exit the process with code 1 (indicates error)
        process.exit(1);
    }
}

//  Export the function so it can be used in other files (like index.js)
export default connectDB;
