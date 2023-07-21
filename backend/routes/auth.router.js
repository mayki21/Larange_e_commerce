   //------------------- Google Auth Here -----------------------------------------

   const express=require("express")
   const bcrypt=require("bcrypt")
   const jwt=require("jsonwebtoken")
   const userModel=require("../models/usermodel")
   const  passport  = require("../connection/google.Oauth");
   const authrouter=express.Router()
   authrouter.get(
    "/google",
    passport.authenticate("google", { scope: ['profile', 'email'] })
  );
  
  authrouter.get(
    "/google/callback",
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

module.exports=authrouter

