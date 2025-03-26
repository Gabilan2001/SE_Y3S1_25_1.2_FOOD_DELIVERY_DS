import express from "express";//help for creating server
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet"
import morgan from "morgan";
import connectDB from "./config/connectDB.js";

dotenv.config//it is get all the data in the .env file and store the data in side then ve can use the datas which is in the .env file
const app=express()//now tha app contain entiar webserver data inside the app for express()

app.use(
    cors({
    credentials:true,// this is allow to send cookies(iwt)
    origin:process.env.FRONTEND_URL//it is allow to requst data from froandend and responce data to froand end

})
);

app.use(
        express.json()
);

app.use(
    cookieParser()
);

app.use(
    morgan('tiny')
);

app.use(
    helmet({
        crossOriginResourcePolicy:false
    })
);

const PORT=process.env.PORT || 8080;

app.get("/",(req,res)=>{
    res.json({
        message:`server is running on the port ${PORT}`
    });
});


//connect DB

connectDB();
app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
});