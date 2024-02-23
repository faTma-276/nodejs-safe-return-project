import mongoose from "mongoose";

const foundChildschema=mongoose.Schema({
    citizenId:{
        type:mongoose.Types.ObjectId,
        ref:"citizen"
    },
    parentphone:{
        type:Number,
    },
    parentName:{
        type:String,
    },
    orphanageName:{
        type:String,
        trim:true
    },
    found:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
export const foundChildmodel=mongoose.model('found Child',foundChildschema)