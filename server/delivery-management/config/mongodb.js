import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB is connected");
        })
       await mongoose.connect(`${process.env.MONGODB_URL}/deliveryManagement`) 
    } catch (error) {
        console.log(error)
    }
}

export default connectDB