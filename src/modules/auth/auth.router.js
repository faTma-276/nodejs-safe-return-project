import  express  from "express";
const authRouter =express.Router()
import { validate} from "../../middleware/validation.js";
import { forgetPassword, loginWithGmail, resetPassword, signIn,signUp, verify,loginWithFacebook  } from "./auth.controller.js";
import { signUpSchema,signInSchema, resetPasswordSchema, forgetPasswordSchema} from "./auth.validate.js";


//signUp
authRouter.post('/SignUp',validate(signUpSchema),signUp)

//signIn
authRouter.post('/signIn',validate(signInSchema),signIn)

//verify email
authRouter.get('/verify/:token',verify)

//forget password
authRouter.post('/forgetpassword',validate(forgetPasswordSchema),forgetPassword)

//reset password
authRouter.post('/resetpassword/:token',validate(resetPasswordSchema),resetPassword)

//loginWithGmail
authRouter.post('/loginWithGmail',loginWithGmail)

//loginWithFacebook
authRouter.post('/loginWithFacebook',loginWithFacebook)

export default authRouter

