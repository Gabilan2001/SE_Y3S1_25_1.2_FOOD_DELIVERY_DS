import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required : [true,"provide name"]
    },
    email:{
        type :String,
        required : [true,"provide email"],
        unique : true
    },
    password : {
        type :String,
        required : [true,"provide password"]
    },
    avatar : {
        type :String,
        default : ""
    },
    mobile:{
        type : Number,
        default:null
    },
    referesh_token : {
        type :String,
        default : ""
    },
    verify_email:{
        type:Boolean,
        default: false
    },
    last_login_date:{
        type:Date,
        default:""
    },
    status:{
        type:String,
        enum:["Active","Inactive","Suspended"],
        default : "Active"
    },
    forgot_password_otp:{
        type:String,
        default :null
    },
    forgot_password_expiry:{
        type:Date,
        default:""
    },
    role:{
    type:String,
    enum: ['ADMIN', 'USER', 'DELIVERY', 'RESTAURANT'],
    default:"USER"
    }

},{
    timestamps:true
})

const usermodel=mongoose.model("User",userSchema)
export default usermodel;