const express=require("express")
const mongoose=require("mongoose")

const connection=mongoose.connect("mongodb://127.0.0.1:27017/DT-Project")

const agentSchema=mongoose.Schema({
    
    name:String,
    email:String,
    mobile:Number,
    age:Number,
})

//make the model

const Agent=mongoose.model("agent",agentSchema)

module.exports=Agent;