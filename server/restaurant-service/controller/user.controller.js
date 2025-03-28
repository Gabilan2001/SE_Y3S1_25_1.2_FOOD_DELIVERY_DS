import sendEmail from "../config/sendEmail.js";  // Function to send emails
import usermodel from "../models/user.model.js"; // User schema (database model)
import bcryptjs from "bcryptjs"; // Library to hash passwords
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"; // HTML template for the email
import { response, text } from "express";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import upload from "../middleware/multer.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
// import generatedOtp from "../utils/generatedOtp.js";
// import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'; 
 

// Function to register a new user
export async function registerUserController(req, res) {
    try {
        // Extract name, email, and password from the request body
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password",
                error: true,
                success: false
            });
        }

        // Check if the email is already registered
        const user = await usermodel.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Email is already registered",
                error: true,
                success: false
            });
        }

        // Generate a salt and hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user object
        const newUser = new usermodel({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user in the database
        const savedUser = await newUser.save();

        // Generate verification email URL
        const verifyEmailUrl = `${process.env.FRONT_END_URL}/verify-email?code=${savedUser._id}`;

        // Send verification email
        await sendEmail({
            sendTo: email,
            subject: "Verify Your Email - DS project IT22060426",
            html: verifyEmailTemplate({ name, url: verifyEmailUrl })
        });

        // Send success response
        return res.status(201).json({
            message: "User registered successfully. Please check your email for verification.",
            error: false,
            success: true,
            data: savedUser
        });

    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}



// Function to verify a user's email
export async function verifyEmailController(req, res) {
    try {
        // Extract the verification code from the request body
        const { code } = req.body;

        // Check if the `code` is provided in the request
        if (!code) {
            return res.status(400).json({
                message: "Verification code is required",
                error: true,
                success: false
            });
        }

        // Find the user in the database using the provided verification code (user's ID)
        const user = await usermodel.findOne({ _id: code });

        // If no user is found, return an error response
        if (!user) {
            return res.status(400).json({
                message: "Invalid verification code",
                error: true,
                success: false
            });
        }

        // Update the user's email verification status to `true`
        const updatedUser = await usermodel.updateOne({ _id: code }, {
            verify_email:true
        })      

        // Send a success response to the client
        return res.json({
            message: "Email verified successfully!",
            error: false,
            success: true
        });

    } catch (error) {
        // Catch and handle any server errors
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}



//function for  login constructer
export async function loginController(req,res) {
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({
                message :"give email and password",
                error : true,
                success:false
            })
        }

        const user=await usermodel.findOne({email})//in heat which user email match it is get all the detail  will be get which is model like
         if(!user){
            return res.status(400).json({
                message:"user not found",
                error : true,
                success : false
            })
         }

         if(user.status !== "Active"){
            return res.status(400).json({
                message: "contact to Admin",
                error:true,
                success : false
            })
         }

         const checkPassword = await bcryptjs.compare(password,user.password)//first parameter fron get the youder input the secound my encriped password

         if(!checkPassword){
            return res.status(400).json({
                message : "check your password",
                error : true,
                success:false
            })
         }

         const accesstoken = await generatedAccessToken(user._id)
         const refreshToken = await generatedRefreshToken(user._id)

         const cookiesOption={
            httponly:true,
            secure : true,
            sameSite :"None"
         }

         res.cookie('accessToken',accesstoken,cookiesOption)
         res.cookie('refreshToken',refreshToken,cookiesOption)

         return res.json({
            message:"Login successfully",
            error:false,
            success:true,
            data:{
                accesstoken,
                refreshToken
            }
         })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error :true,
            success:false
        })
    }
    
}

//function for logout controller
export async function logoutController(req, res) {
    try {
        const userid = req.userId; // User ID from the middleware

        // Debug: Log the userid
        console.log("User ID from middleware:", userid);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.clearCookie("accessToken", cookiesOption);
        res.clearCookie("refreshToken", cookiesOption);

        // Remove the refresh token from the database
        const removeRefreshToken = await usermodel.findByIdAndUpdate(
            userid, 
            { referesh_token: "" }, // Ensure this matches the field name in your schema
            { new: true } // Optional: Returns the updated document
        );

        // Debug: Log the result of the update operation
        console.log("Refresh token removal result:", removeRefreshToken);

        return res.json({
            message: "Logout successful",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//upload user avatar
export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // coming from the auth middle ware 
        const image = request.file  // coming from multer middleware
        const upload = await uploadImageClodinary (image)

        const updateUser = await usermodel.findByIdAndUpdate(userId,{//The findByIdAndUpdate method of Mongoose is a special method that automatically handles the conversion of the userId string to ObjectId.
            
            avatar : upload.url
        })
      
        return response.json({
            message : "upload profile",
            success : true,
            error: false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user deatails

export async function updateUserDetails(req,res) {
    try {
        const userId=req.userId//comeing from auth middle ware
        const {name,email,mobile,password}=req.body//coming from the body it is send data to the server

        let hashedPassword=""//if we did not ddeclare it is hear the proplem is the hashed password is only avilable inside the if blog so we cant use it ouside the if blog


        // Generate a salt and hash the password
        if(password){
         
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);


        }
        const updateUser=await usermodel.updateOne({_id : userId},{
            ...(name&&{name:name}),
            ...(email&&{email:email}),
            ...(mobile&&{mobile:mobile}),
            ...(password&&{password:hashedPassword})
        })

        return res.json({
            message : "update user successfully",
            error : false,
            success : true,
            data : updateUser
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message||error
        })
    }
}


//forgot password function when thr user is not login
export async function forgotPasswordController(req,res) {
    try {
        const { email } = req.body 

        const user = await usermodel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()//teplate for generate otp in side the utils
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await usermodel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from MONEY",
            html : forgotPasswordTemplate({
                name : user.name,//this is the template in side utios folder
                otp : otp
            })
        })

        return res.json({
            message : "check your email",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}



//verify forgot password otp
export async function verifyForgotPasswordOtp(req,res){
    try {
        const { email , otp }  = req.body

        if(!email || !otp){
            return res.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await usermodel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return res.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await usermodel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return res.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//reset the password
export async function resetpassword(req,res){
    try {
        const { email , newPassword, confirmPassword } = req.body 

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await usermodel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await usermodel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return res.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//refresh token controler
export async function refreshToken(req,res){
    try {
        const refreshToken = req.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return res.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie('accessToken',newAccessToken,cookiesOption)

        return res.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get all users
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await usermodel.find({}, "-password -refresh_token"); // Exclude sensitive fields

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error,
            success: false,
        });
    }
};