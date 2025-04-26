import { Router } from 'express'
import { loginController,updateUserDetails,uploadAvatar,logoutController,registerUserController, verifyEmailController, forgotPasswordController, verifyForgotPasswordOtp, resetpassword, refreshToken, userDetails } from '../controller/user.cuntroller.js'
import auth from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js';
import jwt from 'jsonwebtoken';


const userRouter = Router()

userRouter.post ('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)

export default userRouter

