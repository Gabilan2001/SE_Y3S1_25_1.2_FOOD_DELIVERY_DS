import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("please provide mongoDB utl in side in the . env file")
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to mongoDB success full")
    } catch (error) {
        console.error("momgoDB connection error",error.message)
        process.exit(1);
        
    }
    
}
 export default connectDB;