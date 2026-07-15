const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const app=express()
app.use(cors())
app.use(express.json())



app.get("/test",(req,res)=>{
    res.send("hello")
})



app.listen(3000,()=>{
    console.log("server started")
})