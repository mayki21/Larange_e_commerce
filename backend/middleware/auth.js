const jwt=require('jsonwebtoken')
require("dotenv").config()


const auth=(req,res,next)=>
{


    const token=req.headers.authorization
    if(token){
        jwt.verify(token,process.env.tokenpass,function(err, decoded) {
            if(decoded){
                req.body.userID=decoded.userID
                req.body.quantity = 1
                next()
            }else{
                res.status(401).send({"msg":"Wrong Credentials"})
            }
          });
    }else{
        res.status(401).send({"msg":"Login First"})
    }
}
module.exports=auth