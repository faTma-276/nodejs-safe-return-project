import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema=mongoose.Schema({
    Fname:{
        type: String,
        minLenth:[2,'name too short'],
        maxLenth:[20,'name too long'],
        trim:true,
        required:true
    },
    Lname:{
        type: String,
        minLenth:[2,'name too short'],
        maxLenth:[20,'name too long'],
        trim:true,
        required:true
    },
    profilePic:Object,
    userName:String,
    email:{
        type: String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLenth:[5,'password too short'],
        required:true
    },
    passwordChangedAt:Date,
    loggedOutAt:Date,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    phoneNumber:String,
    goverenrate:String,
    verified:{
        type:Boolean,
        default:false
    },
    provider:{
        type:String,
        enum:['system','facebook','google'],
        default:'system'
    }
},{timestamps:true})


userSchema.pre('save',function(){
    this.password=bcrypt.hashSync(this.password , 8);
    this.userName= this.Fname + " " + this.Lname;
    console.log(this)
})

userSchema.pre('findOneAndUpdate',function(){
   if( this._update.password)  this._update.password=bcrypt.hashSync(this._update.password , 8);
   if( this._update.newassword)  this._update.userName= this._update.Fname + " " + this._update.Lname;
})

userSchema.pre('findByIdAndUpdate',function(){
   if( this._update.password)  this._update.password=bcrypt.hashSync(this._update.password , 8);
   if( this._update.newassword)  this._update.userName= this._update.Fname + " " + this._update.Lname;
})

export const userModel=mongoose.model('user',userSchema)