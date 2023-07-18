const express=require("express")
require("dotenv").config()
const connection=require("./connection/db");
const cartRoute=require("./routes/cartroute")
const jeansRouter=require("./routes/jeansroute")
const ShoesRoute=require("./routes/shoesroute")
const topsRoute=require("./routes/toproute")
const userRouter=require("./routes/userroute")
const auth=require("./middleware/auth")
const cors=require("cors")
const app=express()

app.use(express.json())
app.use(cors())

// app.use("/",(req,res)=>{
//     res.status(200).send("heloo")
// })





app.use("/users", userRouter)

app.use("/jeans", jeansRouter)

app.use("/tops", topsRoute)

app.use("/shoes", ShoesRoute)
app.use(auth);
app.use("/cart",cartRoute)
app.use("/admin",AdminRoute)
///////



app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("connected to DATABASE");
    } catch (error) {
        console.log(error);
        
        
    }
})