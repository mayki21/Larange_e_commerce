const mongoose=require("mongoose")

const userschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User"
    },
    image:String
})

const userModel=mongoose.model("user",userschema)
module.exports=userModel;