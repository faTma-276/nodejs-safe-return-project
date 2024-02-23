
import bcrypt from 'bcrypt'
import { catchError } from '../../utils/catchAsyncErr.js'
import { adminModel } from '../../../databases/models/admin.model.js'
import jwt from 'jsonwebtoken'
import { AppError } from '../../utils/AppError.js'


//signUp 
export const signUpAdmin = catchError(async (req,res,next)=>{
   console.log(req.body.confirmPassword)
   let isUser = await adminModel.findOne({email: req.body.email})
   if(isUser) return next (new AppError('account already exists' , 409))
   const user = new adminModel(req.body)
   await user.save()
   res.status(201).json({message: 'success',user})
})



//signIn
export const signInAdmin = catchError(async (req,res,next)=>{
   const{ email , password}=req.body
   let user = await adminModel.findOne({email})
   // console.log(user);
   if(!user || !bcrypt.compareSync(password , user.password))
      return next (new AppError('incorrect email or password' , 409))
      let token = jwt.sign({email:user.email,name:user.userName,id:user._id,role:user.role},process.env.jwt_KEY)
      res.status(201).json({message: 'success',user,token})

})

//protectedRouter
export const protectedAdminRouter =catchError(async (req,res,next)=>{
   let token = req.headers.token
   if (!token) return next(new AppError("error in token or error not provided" , 401))

   let decoded =jwt.verify(token,process.env.jwt_KEY)
   let user = await adminModel.findById(decoded.id)
   if (!user) return next(new AppError("user not found" , 401))
   
   req.user=user
   next()

})
