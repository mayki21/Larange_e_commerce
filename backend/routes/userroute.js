const express=require("express")
const userModel=require("../models/usermodel")
const userrouter=express.Router();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const  passport  = require("../connection/google.Oauth");

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




   //------------------- Google Auth Here -----------------------------------------
   userrouter.get(
    "/auth/google",
    passport.authenticate("google", { scope: ['profile', 'email'] })
  );
  
  userrouter.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
  
  
    async function (req, res) {
        try {
            const fetch_user = await userModel.findOne({ email: req.user.email });
            console.log(fetch_user)
          
          
            if (fetch_user) {
                token_Generator(res, fetch_user.name, fetch_user._id, fetch_user.image);
            } else {
                bcrypt.hash("password", 4, async (err, hash) => {
                    const newUser = new userModel({
                        name: req.user.name,
                        email: req.user.email,
                        password: hash,
                        image : req.user.avatar
                    });
                    await newUser.save();
                    console.log(newUser);
                   
                    token_Generator(res, req.user.name, "login with google",req.user.avatar);
                });
            }
        } catch (error) {
            res.status(500).send({ msg: "An error occurred while authenticating with Google" });
        }
    }
);



function token_Generator(res, name, id,image) {
    let token = jwt.sign(
        { user: name, userID:id},
        process.env.tokenpass,
        { expiresIn: "6d" }
    );
    
    const redirectUrl = `http://127.0.0.1:5500/frontend/index.html?token=${token}&username=${name}&image=${image}`;

    res.redirect(redirectUrl);
}





module.exports=userrouter;