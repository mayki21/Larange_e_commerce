const express=require("express")
const userModel=require("../models/usermodel")
const userrouter=express.Router();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()

userrouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        bcrypt.hash(password,9,async(err,hash)=>{
            const user=new userModel({name,email,password:hash})
            await user.save()
            res.status(200).send({"msg":"registration successful"})

        })
    } catch (error) {
        res.status(400).send({"msg":"error has been occured"})
        
    }
})

userrouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await userModel.findOne({email})
        if(user)
        {
            bcrypt.compare(password,user.password,function(err,result){
                if(result)
                {
                    res.status(200).send({"msg":"login successfully done","token":jwt.sign({"userid":user._id},process.env.tokenpass,{expiresIn:"6h"}),"userdetails":user})
                    
                }
                else
                {
                    res.status(401).send({"msg":"credentials are wrong"})


                }
                
               
            })
        }
        else
        {
            res.status(400).send({"msg":"user not present pls register first"})
        }
    } catch (error) {
        res.status(400).send({"msg":"error occured while login"})
    }
})

userrouter.get("/",async(req,res)=>{
    const user =await userModel.find()
    res.status(200).send(user);
})


module.exports=userrouter;