import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { catchError } from "../../utils/catchAsyncErr.js";
import { AppError } from "../../utils/AppError.js";
import { userModel } from "../../../databases/models/user.model.js";
import { sendEmail, sendpassEmail } from "../../emails/user.email.js";



//signUp 
const signUp = catchError(async (req,res,next)=>{
   console.log(req.body.confirmPassword)
   let isUser = await userModel.findOne({email: req.body.email})
   if(isUser) return next (new AppError('account already exists' , 409))
   const user = new userModel(req.body)
   await user.save()
   sendEmail({email: req.body.email})
   res.status(201).json({message: 'success',user})
})

 //  sendEmail({to:req.body.email,subject:"Email Confirmation",html:html})


//signIn
const signIn = catchError(async (req,res,next)=>{
   const{ email , password}=req.body
   let user = await userModel.findOne({email})
   if(!user || !bcrypt.compareSync(password , user.password))
      return next (new AppError('incorrect email or password' , 409))
   if(!user.verified){
      return next (new AppError('unverified email,Please verify it and try again' , 409))}
      let token = jwt.sign({email:user.email,name:user.Fname,id:user._id,role:user.role},process.env.jwt_KEY)
      res.status(201).json({message: 'success',user,token})

})



//protectedRouter
const protectedRouter =catchError(async (req,res,next)=>{
   let token = req.headers.token
   if (!token) return next(new AppError("error in token or error not provided" , 401))

   let decoded =jwt.verify(token,process.env.jwt_KEY)
   let user = await userModel.findById(decoded.id)
   if (!user) return next(new AppError("user not found" , 401))
   
   if(user.passwordChangedAt){
      let changePasswordDate = parseInt(user.passwordChangedAt.getTime()/1000)
      if(changePasswordDate > decoded.iat ) return next  (new AppError ('invalid token',401))
   }
   if(user.loggedOutAt){
      let loggedOutDate = parseInt(user.loggedOutAt.getTime()/1000)
      if(loggedOutDate > decoded.iat ) return next  (new AppError ('invalid token',401))
   }
   
   req.user=user
   next()

})


//forget password
const forgetPassword=catchError(async(req,res,next)=>{
let isUser = await userModel.findOne({email: req.body.email})
   if(!isUser) return next (new AppError('user not exist' , 409))
   sendpassEmail({email: req.body.email})
   res.status(200).json({message:"success" })

})


//reset password
const resetPassword=catchError(async(req,res,next)=>{
   const {token}=req.params
   const {password,confirmPassword}=req.body
   const decode=jwt.verify(token,process.env.jwt_KEY)
   const user=await userModel.findOne({email:decode.email})
         !user && next(new AppError("email not exist"))
         if(password != confirmPassword)
         return next(new AppError("password must match comfirmpassword"))
         const newuser=await userModel.findOneAndUpdate({email:decode.email},{password},{new:true})
         res.status(200).json({message:"success",newuser})
})


//verify email
const verify = catchError(async(req,res,next)=>{
   const {token} = req.params
console.log(token)
   jwt.verify(token,process.env.jwt_KEY ,async (err,decoded)=>{
      if(err){
            return next(new AppError(err,401))
      }else
      await userModel.findOneAndUpdate({email:decoded.email } ,{verified:true})
      res.status(200).json({message:"success" })
   })
})


//loginWithGmail
const loginWithGmail=catchError(async (req,res,next)=>{
   const {idToken}=req.body
   const client=new OAuth2Client(process.env.CLIENT_ID);
   async function verify(){
      const ticket=await client.verifyIdToken({
         idToken,
         audience:process.env.jwt_KEY,
      })
      const payload=ticket.getpayload();
      return payload
   }
   const{email,email_verified,given_name,family_name,picture}=await verify()
   if(!email_verified){
      return next(new AppError("In-valid email",{cause:400}))
   }
   const user=await userModel.findOne({email:email.toLower()})
   if(user){
      if(user.provider != 'GOOGLE'){
         return next(new AppError(`In-valid provider true provider is ${user.provider}`,{cause:400}))
      }
      const access_token=generateToken({
         payload:{id:user._id,role:user.role},
         expiresIn:60*30
      })
      const refresh_token=generateToken({
         payload:{id:user._id,role:user.role},
         expiresIn:60*60*24*365
      })
      await user.save()
      return res.status(200).json({message:"done",access_token,refresh_token})
   }
   //signup
   //hashpassword
   const customPassword=customAlphabet('0255561111jhgdssfghhjkjjhfaaertyu76gccvbnmkjgfd',9)
   const hashPassword=hash({plaintext:customPassword()})
   //create user
   const{_id}=await userModel.create({
      Fname:given_name,
      Lname:family_name,
      profilePic:{secure_url:picture},
      email,
      password:hashPassword,
      verified:true,
   })
   const access_token=generateToken({
      payload:{id:_id,role},
      expiresIn:60*30
   })
   const refresh_token=generateToken({
      payload:{id:_id,role},
      expiresIn:60*60*24*365
   })
   return res.status(201).json({message:"done",payload})
  })


//loginWithFacebook
const loginWithFacebook = catchError(async (req, res, next) => {
   const { accessToken } = req.body;

   try {
      // Make a request to Facebook API to verify the access token
      const response = await fetch(`https://graph.facebook.com/v13.0/me?fields=id,email,first_name,last_name,picture&access_token=${accessToken}`);
      const userData = await response.json();

      if (userData.error) {
         throw new Error(userData.error.message);
      }

      const { email, first_name, last_name, picture } = userData;

      // Check if the email is verified
      if (!email) {
         return next(new AppError("Invalid email", { cause: 400 }));
      }

      // Check if the user exists in your database
      const user = await userModel.findOne({ email: email.toLower() });

      if (user) {
         // If the user exists, generate access and refresh tokens
         const access_token = generateToken({
            payload: { id: user._id, role: user.role },
            expiresIn: 60 * 30
         });

         const refresh_token = generateToken({
            payload: { id: user._id, role: user.role },
            expiresIn: 60 * 60 * 24 * 365
         });

         return res.status(200).json({ message: "done", access_token, refresh_token });
      }

      // If the user doesn't exist, create a new user
      const customPassword = customAlphabet('0255561111jhgdssfghhjkjjhfaaertyu76gccvbnmkjgfd', 9);
      const hashPassword = hash({ plaintext: customPassword() });

      const newUser = await userModel.create({
         Fname: first_name,
         Lname: last_name,
         profilePic: { secure_url: picture.data.url },
         email,
         password: hashPassword,
         verified: true,
      });

      // Generate access and refresh tokens for the new user
      const access_token = generateToken({
         payload: { id: newUser._id, role: newUser.role },
         expiresIn: 60 * 30
      });

      const refresh_token = generateToken({
         payload: { id: newUser._id, role: newUser.role },
         expiresIn: 60 * 60 * 24 * 365
      });

      return res.status(201).json({ message: "done", access_token, refresh_token });
   } catch (error) {
      return next(new AppError("Error occurred during Facebook authentication", { cause: 500 }));
   }
});



//allowed To
const allowedTo=(...roles)=>{

   return catchError(async (req,res,next)=>{
      if(!roles.includes(req.user.role))
      return next(new AppError('You are not authorized to access this route . you are' + req.user.role,401))
      next()

   })
}



export{
   protectedRouter,
   signIn,
   signUp,
   verify,
   forgetPassword,
   resetPassword,
   allowedTo,
   loginWithGmail,
   loginWithFacebook
}










