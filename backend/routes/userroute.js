const express=require("express")
const userModel=require("../models/usermodel")
const userrouter=express.Router();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const BlackModel=require("../models/Blackmodel")
require("dotenv").config()
// const  passport  = require("../connection/google.Oauth");

userrouter.post("/register",async(req,res)=>{
    const {name,email,password,role}=req.body;
    try {
        bcrypt.hash(password,9,async(err,hash)=>{
            const user=new userModel({name,email,password:hash,role})
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


userrouter.post("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization
        const decoded = jwt.verify(token,process.env.tokenpass)
        const isTokenPresent = await BlackModel.findOne({ token: token })
        if (isTokenPresent) {
            return res.status(404).send({ "msg": "You Have Logout Already" })
        }

        const black = new BlackModel({ token: token })
        await black.save()

        res.send({ "msg": "Logout Succesfully", "ok": true })
    } catch (error) {
        res.status(401).send({ "msg": error.message })

    }
})












module.exports=userrouter;