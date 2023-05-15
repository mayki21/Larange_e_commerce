const express=require("express");
const shoemodel=require("../models/shoesmodel");
const shoeroute=express.Router()

shoeroute.get("/",async(req,res)=>{
    try {
        const data =await shoemodel.find()
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send({"msg":"getting error while getting detail of jeans"})

    }
})

shoeroute.post("/add",async(req,res)=>{
    try {
        const data=new shoesModel(req.body)
        await data.save()
        res.status(200).send({"msg":"jeans added successfully"})
    } catch (error) {
        res.status(400).send({"msg":"error"})

        
    }
})

module.exports=shoeroute;

